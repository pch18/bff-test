import Events from "events";
import { getCtx } from "./context";
import { sleep } from "./utils";
import { PassThrough } from 'stream'

export interface BffStreamContext<ContentType extends Record<string, any>> {
    /** 向客户端发送数据 */
    send: <T extends keyof ContentType>(type: T, id: string | number, content: ContentType[T]) => void;

    /** 连接关闭时执行 */
    onClose: (destoryFn: () => void) => void;

    /** 检查连接是否存活 */
    checkAlive: () => boolean;

    /** 保持连接不退出，常用于事件监听中，但必须传入事件监听的销毁方法 */
    keep: (destoryFn: () => void) => Promise<void>;

    /** 保持连接不退出，并间隔ms，循环执行回调中的方法 */
    loop: (
        loopFn: (times: number) => Promise<void> | void,
        ms: number
    ) => Promise<void>;
}

export class BffStreamHandle<ContentType extends Record<string, any>>{
    on<T extends keyof ContentType>(
        type: T,
        cb: (content: ContentType[T]) => void
    ) { }

    onConnected(fn: () => void) { }

    onDone(fn: () => void) { }

    onError(fn: () => void) { }

    onClose(fn: () => void) { }
}

export const createBffStream = async<ContentType extends Record<string, any>>(
    mainFn: (handle: BffStreamContext<ContentType>) => Promise<void>
) => {

    const ctx = getCtx();
    const stream = new PassThrough()

    const streamWrite = ({ data, ...other }: { id?: string, event?: string, data?: any, retry?: number }) => {
        const lines = Object.entries(other).map(([key, val]) => `${key.replace(/\s+/g, '')}: ${val.toString().replace(/\s+/g, '')}`)
        if (data) {
            lines.push(`data: ${JSON.stringify(data)}`)
        }
        stream.write(lines.join('\n') + '\n\n')
    }
    const send: BffStreamContext<ContentType>["send"] = (type, id, content) => {
        streamWrite({ id: `${String(type)}-${id}`.replace(/\s+/g, ''), event: 'data', data: { id, type, content } })
    };

    streamWrite({ retry: 2000 })
    stream.write(':beat\n\n');
    const beatTimer = setInterval(() => {
        stream.write(':beat\n\n');
    }, 5000)

    let isAlive = true;
    const checkAlive = () => isAlive;

    const events = new Events();
    ctx.req.on("close", () => {
        events.emit("close");
    });

    const onClose = (fn: () => void) => events.addListener("close", fn);
    onClose(() => {
        streamWrite({ event: 'close' })
        // clearInterval(beatTimer)
        isAlive = false;
        events.removeAllListeners();
        ctx.res.end();
    });

    const keep = async (destoryFn: () => void) => {
        await new Promise<void>((resolve) => {
            onClose(destoryFn);
            onClose(resolve);
        });
    };

    const loop = async (
        loopFn: (times: number) => Promise<void> | void,
        ms: number
    ) => {
        let times = 0;
        while (checkAlive()) {
            await sleep(ms);
            await loopFn(times++);
        }
    };

    mainFn({
        send,
        onClose,
        checkAlive,
        keep,
        loop,
    }).catch((e) => {
        streamWrite({ event: 'error', data: e?.message || '发生错误' })
    }).finally(() => {
        streamWrite({ event: 'close' })
        events.emit("close");
    });

    return stream as any as BffStreamHandle<ContentType>;
};
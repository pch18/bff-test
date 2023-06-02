import Events from "events";
import { getCtx } from "./context";
import { sleep } from "./utils";
import { PassThrough } from 'stream'
import { BffStreamHandle } from "@bff-sdk/web/useBffStream";

export interface BffStreamContext<ContentType extends Record<string, any>> {
    /** 向客户端发送数据 */
    send: <T extends keyof ContentType>(type: T, id: string | number | null, content: ContentType[T]) => void;

    /** 连接关闭时执行 */
    onClose: (destoryFn: () => void) => void;

    /** 检查连接是否存活 */
    checkAlive: () => boolean;

    /** 保持连接不退出，常用于事件监听中，但必须传入事件监听的销毁方法 */
    keep: (destoryFn: () => void) => Promise<void>;

    /** 保持连接不退出，并间隔ms，循环执行回调中的方法 */
    loop: (
        loopFn: (stop: () => void) => Promise<void> | void,
        ms: number
    ) => Promise<void>;
}



export const createBffStream = async<ContentType extends Record<string, any>>(
    mainFn: (handle: BffStreamContext<ContentType>) => Promise<void>
) => {
    const ctx = getCtx();

    const mainRun = () => {
        const stream = new PassThrough()

        ctx.request.socket.setTimeout(0);
        ctx.req.socket.setNoDelay(true);
        ctx.req.socket.setKeepAlive(true);
        ctx.set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        });
        ctx.status = 200;
        ctx.body = stream

        const streamWrite = ({ data, ...other }: {
            id?: string,
            event?: string,
            data?: any,
            retry?: number
        }) => {
            const lines = Object.entries(other).map(
                ([key, val]) => `${key.replace(/\s+/g, '')}: ${val.toString().replace(/\s+/g, '')}`
            )
            lines.push(`data: ${data ? JSON.stringify(data) : ''}`)
            stream.write(lines.join('\n') + '\n\n')
        }
        const send: BffStreamContext<ContentType>["send"] = (type, id, content) => {
            streamWrite({
                ...(id === null ? {} : { id: JSON.stringify(id) }),
                event: 'data',
                data: { id, type, content }
            })
        };

        streamWrite({ event: 'beat' })
        const beatTimer = setInterval(() => {
            streamWrite({ event: 'beat' })
        }, 4000)

        let isAlive = true;
        const checkAlive = () => isAlive;

        const events = new Events();
        ctx.req.on("close", () => {
            events.emit("close");
        });

        const onClose = (fn: () => void) => events.addListener("close", fn);
        onClose(() => {
            streamWrite({ event: 'close' })
            clearInterval(beatTimer)
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

        const loop: BffStreamContext<ContentType>["loop"] = async (
            loopFn,
            ms
        ) => {
            let isStop = false
            while (checkAlive() && !isStop) {
                await sleep(ms);
                await loopFn(() => isStop = true);
            }
        };

        mainFn({
            send,
            onClose,
            checkAlive,
            keep,
            loop,
        }).catch((e) => {
            streamWrite({ event: 'failed', data: e?.message || '发生错误' })
        }).finally(() => {
            events.emit("close");
        });
    }

    const run = async () => {
        if (ctx.query['_bff_upgrade'] === 'bff-stream') {
            await mainRun()
        } else {
            ctx.status = 202;
            ctx.body = {
                _bff_upgrade: 'bff-stream'
            }
        }
    }

    const handle = new BffStreamHandle<ContentType>()
    Object.assign(handle, { run })

    return handle
};
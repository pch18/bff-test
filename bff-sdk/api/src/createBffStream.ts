import Events from "events";
import { getCtx } from "./context";
import { CustomResponse, sleep } from "./utils";
import { PassThrough } from 'stream'
import { type BffEventSource } from "../../web/useBffStream";

export interface BffStreamContext<DataTypes extends Record<string, any>, IdType> {
    /** 向客户端发送数据 */
    send: <T extends keyof DataTypes>(type: T, id: IdType | null, content: DataTypes[T]) => Promise<void>;

    /** 连接关闭时执行 */
    onClose: (destoryFn: () => void) => void;

    /** 连接结束，并关闭连接，客户端不再重联 */
    done: () => void

    /** 检查连接是否存活 */
    checkAlive: () => boolean;

    /** 保持连接不退出，常用于事件监听中，但必须传入事件监听的销毁方法 */
    keep: (destoryFn: () => void) => Promise<void>;

    /** 保持连接不退出，并间隔ms，循环执行回调中的方法 */
    loop: (
        loopFn: (stop: () => void) => Promise<void> | void,
        ms: number
    ) => Promise<void>;

    /** 上次的id位置 */
    lastId: IdType | undefined
}

export const createBffStream = async<DataTypes extends Record<string, any>, IdType = number>(
    mainFn: (handle: BffStreamContext<DataTypes, IdType>) => Promise<void>
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

        const streamWrite = ({ id, event, data, retry }: {
            id?: IdType,
            event: 'data' | 'beat' | 'close' | 'done' | 'failed',
            data?: any,
            retry?: number
        }) => {
            const lines = [`event: ${event}`]
            lines.push(`data: ${data ? JSON.stringify(data) : ''}`)
            if (id !== undefined) {
                lines.push(`id: ${JSON.stringify(id)}`)
            }
            if (retry !== undefined) {
                lines.push(`retry: ${retry}`)
            }
            return new Promise<void>((resolve, reject) => {
                stream.write(lines.join('\n') + '\n\n', err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
        }
        const send: BffStreamContext<DataTypes, IdType>["send"] = (type, id, content) => {
            return streamWrite({
                ...(id === null ? {} : { id }),
                event: 'data',
                data: { id, type, content }
            })
        };

        streamWrite({ event: 'beat' })
        const beatTimer = setInterval(() => {
            streamWrite({ event: 'beat' })
        }, 3000)

        let isAlive = true;
        const checkAlive = () => isAlive;

        const events = new Events();
        ctx.req.on("close", () => {
            events.emit("close");
        });

        const onClose = (fn: () => void) => events.addListener("close", fn);
        onClose(() => {
            if (isAlive === false) return
            streamWrite({ event: 'close' })
            clearInterval(beatTimer)
            events.removeAllListeners();
            ctx.res.end();
            isAlive = false;
        });

        const done = () => {
            streamWrite({ event: 'done' })
            events.emit("close");
        }

        const keep = async (destoryFn: () => void) => {
            await new Promise<void>((resolve) => {
                onClose(destoryFn);
                onClose(resolve);
            });
        };

        const loop: BffStreamContext<DataTypes, IdType>["loop"] = async (
            loopFn,
            ms
        ) => {
            let isStop = false
            while (checkAlive() && !isStop) {
                await sleep(ms);
                await loopFn(() => isStop = true);
                if (isStop) break
            }
        };

        let lastId: IdType | undefined
        try {
            const headerLastId = ctx.header['last-event-id']
            if (typeof headerLastId === 'string') {
                lastId = JSON.parse(headerLastId)
            }
        } catch { }

        mainFn({
            send,
            onClose,
            checkAlive,
            done,
            keep,
            loop,
            lastId
        }).then(() => {
            streamWrite({ event: 'done' })
        }).catch((e) => {
            streamWrite({ event: 'failed', data: e?.message || '发生错误' })
        }).finally(() => {
            events.emit("close");
        });
    }

    const run = async () => {
        if (ctx.header['accept'] === 'text/event-stream') {
            await mainRun()
        } else {
            ctx.status = 202;
            ctx.body = {
                _bff_upgrade: 'bff-event-source'
            }
        }
    }

    const handle = new CustomResponse() as BffEventSource<DataTypes>
    Object.assign(handle, { run })

    return handle
};
import { ApiError, NetError } from "./error"


declare const __BFF_API_PATH_PREFIX__: string

const apiCallFn = async (path: string[], ...params: any[]) => {
  const resRaw = await fetch(`${__BFF_API_PATH_PREFIX__}${path.join('/')}`, {
    method: 'post',
    body: JSON.stringify({ params, time: new Date().getTime() }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (resRaw.status >= 200 && resRaw.status < 300) {
    const resJson = await resRaw.json()
    if (resJson.error) {
      throw new ApiError(resJson.msg, resJson.code, resRaw.status)
    } else {
      return resJson.data
    }
  } else {
    const msg = `[${resRaw.status}] ${await resRaw.text() || '服务器开小差啦~'}`
    throw new NetError(msg, resRaw.status)
  }
}

const createBffRequestInstance = (opts?: {
  errorEventsFn?: (err: MixedError) => void
}) => {
  const bffRequest = new Proxy({}, {
    get(_, key: string) {
      const path = [key]
      const callFn = async (...args: any[]) => {
        try {
          return await apiCallFn(path, ...args)
        } catch (e) {
          opts?.errorEventsFn?.(e as any)
          throw e
        }
      }
      const callChain: any = new Proxy(callFn, {
        get(_, key: string) {
          path.push(key)
          return callChain
        }
      })
      return callChain
    }
  })
  return bffRequest
}

type MixedError = ApiError | NetError | Error

const fnRequestErrorEvent = {} as {
  [name: string]: (err: MixedError) => void
}

/** 用于统一处理报错事件, 例如请求出错时toast提示 */
export const registerRequestErrorEvent = (name: string, fn: (err: MixedError) => void) => {
  fnRequestErrorEvent[name] = fn
}

const emitRequestErrorEvents = (err: MixedError, skipEventName?: string[]) => {
  Object.entries(fnRequestErrorEvent).forEach(([name, fn]) => {
    // 如果包含指定的 skipEventName 则不执行对应的 event
    if (skipEventName?.includes(name)) {
      return;
    }
    try { fn(err) } catch { }
  })
}

const bffRequest = createBffRequestInstance({ errorEventsFn: emitRequestErrorEvents })
export default bffRequest

/** 使用此函数包裹 api 调用的话, 则不走 Error Event, 用于不需要报错提示的场景, 可以指定 eventNames, 实现部分跳过 */
export const skipErrorEvent = <T>(api: T, eventNames?: string | string[]): T => {
  return createBffRequestInstance({ errorEventsFn: err => emitRequestErrorEvents(err, typeof eventNames === 'string' ? [eventNames] : eventNames) }) as any
}

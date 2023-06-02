import { BffErrorEvent } from "./catchError"
import { ApiError, NetError } from "./error"


declare const __BFF_API_PATH_PREFIX__: string

const apiCallFn = async (path: string[], ...params: any[]) => {
  try {
    const requestPath = `${__BFF_API_PATH_PREFIX__}${path.join('/')}`
    const resRaw = await fetch(requestPath, {
      method: 'post',
      body: JSON.stringify({ params, time: new Date().getTime() }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (resRaw.status >= 200 && resRaw.status < 300) {
      const resJson = await resRaw.json()
      if (resJson.error === true) {
        throw new ApiError(resJson.msg, resJson.code, resRaw.status)
      } else if (resJson.error === false) {
        return resJson.data
      } else if (resJson._bff_upgrade === 'bff-stream') {
        return createBffHandle(requestPath)
      } else {
        throw new Error('请求数据异常！')
      }
    } else {
      const msg = `[${resRaw.status}] ${await resRaw.text() || '服务器开小差啦~'}`
      throw new NetError(msg, resRaw.status)
    }
  } catch (e) {
    const error = e instanceof ApiError || e instanceof NetError ? e : new NetError('请求失败...', -1)
    window.dispatchEvent(new BffErrorEvent(error))
    throw error
  }
}

const createBffHandle = (_requestPath: string) => {

  const evnetMap = {} as Record<string, Function[]>
  const regEvent = (type: string, fn: Function) => {
    if (!evnetMap[type]) {
      evnetMap[type] = [fn]
    } else {
      evnetMap[type].push(fn)
    }
  }
  const callEvent = (type: string, prarm?: any) => {
    evnetMap[type]?.forEach(f => {
      try { f(prarm) } catch { }
    })
  }

  const requestPath = _requestPath + '?_bff_upgrade=bff-stream'
  const eventSource = new EventSource(requestPath);

  regEvent('onDestory', () => eventSource.close())

  eventSource.onopen = (e) => callEvent('onOpen', e)
  regEvent('onDestory', () => eventSource.onopen = null)

  const onError = (e: Event) => callEvent('onError', e)
  eventSource.onerror = onError
  eventSource.addEventListener('error', onError)
  regEvent('onDestory', () => eventSource.onerror = null)
  regEvent('onDestory', () => eventSource.removeEventListener('error', onError))

  const onBeat = (e: Event) => callEvent('onBeat', e)
  eventSource.addEventListener('beat', onBeat)
  regEvent('onDestory', () => eventSource.removeEventListener('beat', onBeat))

  const onDone = (e: Event) => callEvent('onDone', e)
  eventSource.addEventListener('done', onDone)
  regEvent('onDone', () => callEvent('onDestory'))
  regEvent('onDestory', () => eventSource.removeEventListener('done', onDone))

  const onData = (e: MessageEvent) => {
    const data = JSON.parse(e.data)
    callEvent(`onData_${data.type}}`, data.content)
  }
  eventSource.addEventListener('data', onData)
  regEvent('onDestory', () => eventSource.removeEventListener('data', onData))

  return {
    on: (type: string, fn: (data: any) => void) => regEvent(`onData_${type}}`, fn),
    onOpen: (fn: (e: Event) => void) => regEvent('onOpen', fn),
    onBeat: (fn: (e: Event) => void) => regEvent('onBeat', fn),
    onDone: (fn: (e: Event) => void) => regEvent('onDone', fn),
    onError: (fn: (e: Event) => void) => regEvent('onError', fn),
    onClose: (fn: (e: Event) => void) => regEvent('onClose', fn),
    destory: () => callEvent('onDestory')
  }
}

export class BffStreamHandle<ContentType extends Record<string, any>> {
  on<T extends keyof ContentType>(
    type: T,
    cb: (content: ContentType[T]) => void
  ) { }

  onOpen(fn: () => void) { }

  onDone(fn: () => void) { }

  onError(fn: () => void) { }

  onClose(fn: () => void) { }
}



const bffRequest = new Proxy({}, {
  get(_, key: string) {
    const path = [key]
    const callFn = apiCallFn.bind(null, path)
    const callChain: any = new Proxy(callFn, {
      get(_, key: string) {
        path.push(key)
        return callChain
      }
    })
    return callChain
  }
})


export default bffRequest
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
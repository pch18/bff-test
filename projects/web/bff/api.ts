let apiCallFn = async (path, ...data) => {
  const resRaw = await fetch(`/${path.join('/')}`, {
    method: 'post',
    body: JSON.stringify({ data })
  })
  if (resRaw.status >= 200 && resRaw.status < 300) {
    const resJson = await resRaw.json()
    return resJson.data
  } else {
    throw new Error(`fetch error with code: ${resRaw.status}`)
  }
}

const api = new Proxy({}, {
  get(_, key) {
    const path = [key]
    const callFn = apiCallFn.bind(null, path)
    const callChain = new Proxy(callFn, {
      get(_, key) {
        path.push(key)
        return callChain
      }
    })
    return callChain
  }
})



export default api
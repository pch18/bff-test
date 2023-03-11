
export const genPathControllerMap = (controller: any, prefix: string, maxDeep = 10) => {
  const fnMap = new Map<string, Function>()
  const readController = (con: any, pre: string, deep: number) => {
    Object.keys(con).forEach(key => {
      if (typeof con[key] === 'function') {
        fnMap.set(pre + key, con[key])
      } else if (typeof con[key] === 'object' && deep <= maxDeep) {
        readController(con[key], pre + key + '/', deep + 1)
      }
    })
  }
  readController(controller, prefix, 1)
  return fnMap
}

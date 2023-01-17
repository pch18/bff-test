
export const genPathControllerMap = (controller: any, prefix: string, maxDeep = 10) => {
  const map = {} as Record<string, Function>
  const readCon = (con: any, pre: string, deep: number) => {
    Object.keys(con).forEach(key => {
      if (typeof con[key] === 'function') {
        map[pre + key] = con[key]
      } else if (typeof con[key] === 'object' && deep <= maxDeep) {
        readCon(con[key], pre + key + '/', deep + 1)
      }
    })
  }
  readCon(controller, prefix, 1)
  return map
}

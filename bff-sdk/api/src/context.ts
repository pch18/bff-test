import { AsyncLocalStorage } from "async_hooks"
import { ParameterizedContext } from "koa"


type StorageType = ParameterizedContext
const asyncLocalStorage = new AsyncLocalStorage<StorageType>()

export const alsRun = (data: StorageType, fn: any) => {
  return asyncLocalStorage.run(data, fn)
}

export const getCtx = () => {
  const ctx = asyncLocalStorage.getStore()
  if (!ctx) {
    throw new Error('只能在请求上下文中使用 getCtx')
  }
  return ctx
}
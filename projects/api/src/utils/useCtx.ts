import { AsyncLocalStorage } from "async_hooks"
import { DefaultContext } from "koa"

type StorageType = { ctx: DefaultContext, [key: string]: any }

const asyncLocalStorage = new AsyncLocalStorage<StorageType>()

export const alsRun = (data: StorageType, fn: any) => {
  asyncLocalStorage.run(data, fn)
}

export const useCtx = () => {
  return asyncLocalStorage.getStore()!
}
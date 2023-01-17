import { Middleware } from "koa"
import _ from "lodash"
import { AsyncLocalStorage } from "async_hooks"
import { ParameterizedContext } from "koa"
import { ApiError, NetError } from "./error"
import Bodyparser from 'koa-bodyparser'


type StorageType = ParameterizedContext
const asyncLocalStorage = new AsyncLocalStorage<StorageType>()

export const alsRun = (data: StorageType, fn: any) => {
  return asyncLocalStorage.run(data, fn)
}

export const useCtx = () => {
  const ctx = asyncLocalStorage.getStore()
  if (!ctx) {
    throw new Error('只能在请求上下文中使用 useCtx')
  }
  return ctx
}
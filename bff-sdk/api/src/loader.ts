import { Middleware } from "koa"
import _ from "lodash"
import { AsyncLocalStorage } from "async_hooks"
import { ParameterizedContext } from "koa"
import { ApiError, NetError } from "./error"

export const createBffLoader = (controller: any): Middleware => {
  return async (ctx, next) => {
    const callPath = ctx.path.split('/').slice(1)

    // 前置 has 判断, 避免访问到原型上的属性
    const callFn = _.has(controller, callPath) ? _.get(controller, callPath) : undefined

    if (callFn) {
      try {
        const resp = await alsRun(ctx, callFn)
        ctx.status = 200;
        ctx.body = {
          error: false,
          code: 0,
          body: resp
        }
      } catch (e) {
        if (e instanceof ApiError) {
          ctx.status = e.httpCode;
          ctx.body = {
            error: true,
            code: e.apiCode,
            msg: e.message
          }
        } else if (e instanceof NetError) {
          ctx.status = e.httpCode;
          ctx.body = e.message
        } else {

        }
      }
    }
    await next()
  }
}


type StorageType = ParameterizedContext
const asyncLocalStorage = new AsyncLocalStorage<StorageType>()

const alsRun = (data: StorageType, fn: any) => {
  return asyncLocalStorage.run(data, fn)
}

export const useCtx = () => {
  const ctx = asyncLocalStorage.getStore()
  if (!ctx) {
    throw new Error('只能在请求上下文中使用 useCtx')
  }
  return ctx
}
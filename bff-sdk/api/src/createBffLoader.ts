import { Middleware } from "koa"
import { ApiError, NetError } from "./error"
import Bodyparser from 'koa-bodyparser'
import { alsRun } from "./context"
import { genPathControllerMap } from "./genPathControllerMap"
import { PassThrough } from "stream"

export const createBffLoader = (controller: any, opts?: {
  /** controller 对应的路由前缀,默认为 /api/ */
  controllerPathPrefix?: string
  /** 前置调用, 可以通过抛错阻止 controller 调用, 常用作权限/登录态校验 */
  preCallFn?: (callFn: Function) => any,
  /** 可以输出一些 debug log */
  debug?: boolean,
}): Middleware => {
  const {
    controllerPathPrefix = '/api/',
    preCallFn,
    debug = false,
  } = opts || {}

  const bodyParser = Bodyparser()
  const pathControllerMap = genPathControllerMap(controller, controllerPathPrefix)
  if (debug) {
    console.debug('pathControllerMap@createBffLoader: ', pathControllerMap)
  }

  return async (ctx, next) => {

    // 非api请求, 通过前缀判断, 直接跳过处理
    if (!ctx.path.startsWith(controllerPathPrefix)) {
      return next()
    }

    try {
      const callFn = pathControllerMap.get(ctx.path)
      if (!callFn) {
        throw new NetError('没有对应的api调用', 404)
      }

      // 解析 post body 数据
      await bodyParser(ctx, () => Promise.resolve(undefined));
      const { params = [] } = ctx.request.body as any || {}
      if (!(params instanceof Array)) {
        throw new NetError('请求数据不合法', 400)
      }

      // 在调用前运行前置调用preCallFn
      const callFnBindParams = async () => {
        await preCallFn?.(callFn)
        return await callFn(...params)
      }

      const resp = await alsRun(ctx, callFnBindParams)

      if (resp instanceof PassThrough) {
        ctx.request.socket.setTimeout(0);
        ctx.req.socket.setNoDelay(true);
        ctx.req.socket.setKeepAlive(true);
        ctx.set({
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        });
        ctx.status = 200;
        ctx.body = resp
      } else {
        ctx.status = 200;
        ctx.body = {
          error: false,
          code: 0,
          data: resp
        }
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
        ctx.status = 500;
        ctx.body = (e as any)?.message || '内部错误'
      }
    }

    return next()

  }
}



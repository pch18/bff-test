import { ApiError, NetError } from "./error";


type CatchType = 'bubble' | 'focus'

const createApiEvent = (fn: (err: ApiError) => void) => {
  return (event: any) => {
    if (event?.reason instanceof ApiError) {
      fn(event.reason)
    }
  }
}

const createNetEvent = (fn: (err: NetError) => void) => {
  return (event: any) => {
    if (event?.reason instanceof NetError) {
      fn(event.reason)
    }
  }
}

export const catchApiError = (fn: (err: ApiError) => void, catchType: CatchType = 'bubble') => {
  if (catchType === 'bubble') {
    window.addEventListener("unhandledrejection", createApiEvent(fn));
  } else if (catchType === 'focus') {
    window.addEventListener("bffapirejection", createApiEvent(fn));
  }
}

export const catchNetError = (fn: (err: NetError) => void, catchType: CatchType = 'bubble') => {
  if (catchType === 'bubble') {
    window.addEventListener("unhandledrejection", createNetEvent(fn));
  } else if (catchType === 'focus') {
    window.addEventListener("bffapirejection", createNetEvent(fn));
  }
}


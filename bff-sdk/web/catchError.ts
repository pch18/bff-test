import { ApiError, NetError } from "./error";


type CatchType = 'bubble' | 'focus'


export class BffErrorEvent extends Event {
  reason: ApiError | NetError
  constructor(reason: ApiError | NetError) {
    super('bffapirejection')
    this.reason = reason
  }
}

const dispatchBffErrorEvent = (fn: (err: ApiError | NetError) => void) => {
  return (event?: any) => {
    if (event?.reason instanceof ApiError || event?.reason instanceof NetError) {
      fn(event.reason)
    }
  }
}


export const catchBffError = (fn: (err: ApiError | NetError) => void, catchType: CatchType = 'bubble') => {
  if (catchType === 'bubble') {
    window.addEventListener("unhandledrejection", dispatchBffErrorEvent(fn));
  } else if (catchType === 'focus') {
    window.addEventListener("bffapirejection", dispatchBffErrorEvent(fn));
  }
}

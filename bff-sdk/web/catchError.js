import { ApiError, NetError } from "./error";
export class BffErrorEvent extends Event {
    reason;
    constructor(reason) {
        super('bffapirejection');
        this.reason = reason;
    }
}
const dispatchBffErrorEvent = (fn) => {
    return (event) => {
        if (event?.reason instanceof ApiError || event?.reason instanceof NetError) {
            fn(event.reason);
        }
    };
};
/**
 * 监听捕获bff错误，传入对于错误的处理方式。
 * catchType为捕获类型
 * - focus 为捕获所有错误，只要请求有异常，都会触发
 * - bubble 为捕获没有catch处理的错误
 */
export const catchBffError = (fn, catchType = 'bubble') => {
    if (catchType === 'bubble') {
        window.addEventListener("unhandledrejection", dispatchBffErrorEvent(fn));
    }
    else if (catchType === 'focus') {
        window.addEventListener("bffapirejection", dispatchBffErrorEvent(fn));
    }
};

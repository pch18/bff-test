import { ApiError, NetError } from "./error";

export const catchApiError = (fn: (err: ApiError) => void, preventDefault = false) => {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof ApiError) {
      if (preventDefault) {
        // 增加阻止默认事件，阻止页面报错
        event.preventDefault();
      }
      fn(event.reason)
    }
  });
}

export const catchNetError = (fn: (err: NetError) => void, preventDefault = false) => {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof NetError) {
      if (preventDefault) {
        // 增加阻止默认事件，阻止页面报错
        event.preventDefault();
      }
      fn(event.reason)
    }
  });
}

export const catchApiOrNetError = (fn: (err: ApiError | NetError) => void, preventDefault = false) => {
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof ApiError || event.reason instanceof NetError) {
      if (preventDefault) {
        // 增加阻止默认事件，阻止页面报错
        event.preventDefault();
      }
      fn(event.reason)
    }
  });
}


// 业务抛错
export class ApiError extends Error {
    /** 返回的业务状态码, 用作可以用作业务逻辑判断 */
    apiCode;
    /** 返回的http状态码, 默认202 */
    httpCode;
    constructor(
    /** 抛错内容 */
    message, 
    /** 返回的业务状态码, 用作可以用作业务逻辑判断, 默认为1 */
    apiCode = 1, 
    /** 返回的http状态码, 默认202 */
    httpCode = 202) {
        if (httpCode < 200 || httpCode >= 300) {
            throw new Error('ApiError 的 httpCode 必须为 2xx');
        }
        super();
        this.message = message;
        this.apiCode = apiCode;
        this.httpCode = httpCode;
    }
}
export class NetError extends Error {
    /** 返回的http状态码, 默认500 */
    httpCode;
    constructor(
    /** 抛错内容 */
    message, 
    /** 返回的http状态码, 默认500 */
    httpCode = 500) {
        if (httpCode >= 200 && httpCode < 300) {
            throw new Error('NetError 的 httpCode 不可为 2xx');
        }
        super();
        this.message = message;
        this.httpCode = httpCode;
    }
}

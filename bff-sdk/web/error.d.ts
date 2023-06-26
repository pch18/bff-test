export declare class ApiError extends Error {
    /** 返回的业务状态码, 用作可以用作业务逻辑判断 */
    apiCode: number;
    /** 返回的http状态码, 默认202 */
    httpCode: number;
    constructor(
    /** 抛错内容 */
    message: string, 
    /** 返回的业务状态码, 用作可以用作业务逻辑判断, 默认为1 */
    apiCode?: number, 
    /** 返回的http状态码, 默认202 */
    httpCode?: number);
}
export declare class NetError extends Error {
    /** 返回的http状态码, 默认500 */
    httpCode: number;
    constructor(
    /** 抛错内容 */
    message: string, 
    /** 返回的http状态码, 默认500 */
    httpCode?: number);
}

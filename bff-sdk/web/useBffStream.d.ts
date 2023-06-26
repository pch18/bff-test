export declare class BffEventSource<DataTypes extends Record<string, any>> extends EventSource {
    _d?: DataTypes;
}
export declare const useBffStream: <DataTypes extends Record<string, any>>(handle: () => Promise<BffEventSource<DataTypes>>, dataEvents: { [Key in keyof DataTypes]?: ((dataType: DataTypes[Key]) => void) | undefined; }, opts?: {
    /** 连接打开后 */
    onOpen?: ((e: Event) => void) | undefined;
    /** 连接建立失败 */
    onError?: ((e: Event) => void) | undefined;
    /** api运行出错 */
    onFailed?: ((e: MessageEvent) => void) | undefined;
    /** 意外连接断开 */
    onClose?: ((e: MessageEvent) => void) | undefined;
    /** 执行完成，服务端主动断开链接 */
    onDone?: ((e: MessageEvent) => void) | undefined;
    /** 心跳包 */
    onBeat?: ((e: MessageEvent) => void) | undefined;
    /** 是否自动连接，默认为true */
    autoConnect?: boolean | undefined;
} | undefined) => {
    es: EventSource | undefined;
    connect: () => Promise<BffEventSource<DataTypes> | undefined>;
};

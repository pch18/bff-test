import { useCallback, useLayoutEffect, useRef } from "react";

export class BffEventSource<
  DataTypes extends Record<string, any>
> extends EventSource {
  _d?: DataTypes;
}

export const useBffStream = <DataTypes extends Record<string, any>>(
  handle: () => Promise<BffEventSource<DataTypes>>,
  dataEvents: { [Key in keyof DataTypes]?: (dataType: DataTypes[Key]) => void },
  opts?: {
    /** 连接打开后 */
    onOpen?: (e: Event, es: EventSource) => void;
    /** 连接建立失败 */
    onError?: (e: Event, es: EventSource) => void;
    /** api运行出错 */
    onFailed?: (e: MessageEvent, es: EventSource) => void;
    /** 意外连接断开 */
    onClose?: (e: MessageEvent, es: EventSource) => void;
    /** 执行完成，服务端主动断开链接 */
    onDone?: (e: MessageEvent, es: EventSource) => void;
    /** 心跳包 */
    onBeat?: (e: MessageEvent, es: EventSource) => void;
    /** 是否自动连接，默认为true */
    autoConnect?: boolean;
  }
) => {
  const dataEventsRef = useRef(dataEvents);
  dataEventsRef.current = dataEvents;

  const optsRef = useRef(opts);
  optsRef.current = opts;

  const esRef = useRef<EventSource>();

  const onOpen = useCallback(
    (e: Event) => optsRef.current?.onOpen?.(e, esRef.current!),
    []
  );
  const onError = useCallback(
    (e: Event) => optsRef.current?.onError?.(e, esRef.current!),
    []
  );
  const onFailed = useCallback(
    (e: MessageEvent) => optsRef.current?.onFailed?.(e, esRef.current!),
    []
  );
  const onClose = useCallback((e: MessageEvent) => {
    optsRef.current?.onClose?.(e, esRef.current!);
    esRef.current?.close();
    esRef.current?.removeEventListener("open", onOpen);
    esRef.current?.removeEventListener("error", onError);
    esRef.current?.removeEventListener("failed", onFailed);
    esRef.current?.removeEventListener("close", onClose);
    esRef.current?.removeEventListener("beat", onBeat);
    esRef.current?.removeEventListener("done", onDone);
    esRef.current?.removeEventListener("data", onData);
  }, []);
  const onBeat = useCallback(
    (e: MessageEvent) => optsRef.current?.onBeat?.(e, esRef.current!),
    []
  );
  const onDone = useCallback((e: MessageEvent) => {
    optsRef.current?.onDone?.(e, esRef.current!);
    esRef.current?.close();
  }, []);
  const onData = useCallback((e: MessageEvent) => {
    const { type, content } = JSON.parse(e.data);
    dataEventsRef.current[type]?.(content);
  }, []);

  const connect = async () => {
    if (esRef.current) {
      esRef.current?.close();
    }

    const es = await handle();
    esRef.current = es;

    es.addEventListener("open", onOpen);
    es.addEventListener("error", onError);
    es.addEventListener("failed", onFailed);
    es.addEventListener("close", onClose);
    es.addEventListener("beat", onBeat);
    es.addEventListener("done", onDone);
    es.addEventListener("data", onData);

    return es;
  };

  useLayoutEffect(() => {
    if (optsRef.current?.autoConnect !== false) {
      void connect();
    }
    return () => {
      esRef.current?.close();
      esRef.current?.removeEventListener("open", onOpen);
      esRef.current?.removeEventListener("error", onError);
      esRef.current?.removeEventListener("failed", onFailed);
      esRef.current?.removeEventListener("close", onClose);
      esRef.current?.removeEventListener("beat", onBeat);
      esRef.current?.removeEventListener("done", onDone);
      esRef.current?.removeEventListener("data", onData);
    };
  }, []);

  return {
    es: esRef.current,
    connect,
  };
};

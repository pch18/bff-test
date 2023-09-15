import { useCallback, useLayoutEffect, useRef } from "react";
export class BffEventSource extends EventSource {
    _d;
}
export const useBffStream = (handle, dataEvents, opts) => {
    const dataEventsRef = useRef(dataEvents);
    dataEventsRef.current = dataEvents;
    const optsRef = useRef(opts);
    optsRef.current = opts;
    const esRef = useRef();
    const onOpen = useCallback((e) => optsRef.current?.onOpen?.(e, esRef.current), []);
    const onError = useCallback((e) => optsRef.current?.onError?.(e, esRef.current), []);
    const onFailed = useCallback((e) => optsRef.current?.onFailed?.(e, esRef.current), []);
    const onClose = useCallback((e) => {
        optsRef.current?.onClose?.(e, esRef.current);
        esRef.current?.close();
        esRef.current?.removeEventListener("open", onOpen);
        esRef.current?.removeEventListener("error", onError);
        esRef.current?.removeEventListener("failed", onFailed);
        esRef.current?.removeEventListener("close", onClose);
        esRef.current?.removeEventListener("beat", onBeat);
        esRef.current?.removeEventListener("done", onDone);
        esRef.current?.removeEventListener("data", onData);
    }, []);
    const onBeat = useCallback((e) => optsRef.current?.onBeat?.(e, esRef.current), []);
    const onDone = useCallback((e) => {
        optsRef.current?.onDone?.(e, esRef.current);
        esRef.current?.close();
    }, []);
    const onData = useCallback((e) => {
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

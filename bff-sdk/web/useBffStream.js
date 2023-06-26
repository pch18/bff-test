import { useCallback, useLayoutEffect, useRef } from 'react';
export class BffEventSource extends EventSource {
    _d;
}
export const useBffStream = (handle, dataEvents, opts) => {
    const dataEventsRef = useRef(dataEvents);
    dataEventsRef.current = dataEvents;
    const optsRef = useRef(opts);
    optsRef.current = opts;
    const esRef = useRef();
    const onOpen = useCallback((e) => optsRef.current?.onOpen?.(e), []);
    const onError = useCallback((e) => optsRef.current?.onError?.(e), []);
    const onFailed = useCallback((e) => optsRef.current?.onFailed?.(e), []);
    const onClose = useCallback((e) => optsRef.current?.onClose?.(e), []);
    const onBeat = useCallback((e) => optsRef.current?.onBeat?.(e), []);
    const onDone = useCallback((e) => {
        optsRef.current?.onDone?.(e);
        esRef.current?.close();
    }, []);
    const onData = useCallback((e) => {
        const { type, content } = JSON.parse(e.data);
        dataEventsRef.current[type]?.(content);
    }, []);
    const connect = async () => {
        if (esRef.current) {
            return;
        }
        const es = await handle();
        esRef.current = es;
        es.addEventListener('open', onOpen);
        es.addEventListener('error', onError);
        es.addEventListener('failed', onFailed);
        es.addEventListener('close', onClose);
        es.addEventListener('beat', onBeat);
        es.addEventListener('done', onDone);
        es.addEventListener('data', onData);
        return es;
    };
    useLayoutEffect(() => {
        if (optsRef.current?.autoConnect !== false) {
            connect();
        }
        return () => {
            esRef.current?.close();
            esRef.current?.removeEventListener('open', onOpen);
            esRef.current?.removeEventListener('error', onError);
            esRef.current?.removeEventListener('failed', onFailed);
            esRef.current?.removeEventListener('close', onClose);
            esRef.current?.removeEventListener('beat', onBeat);
            esRef.current?.removeEventListener('done', onDone);
            esRef.current?.removeEventListener('data', onData);
        };
    }, []);
    return {
        es: esRef.current,
        connect
    };
};

import { BffErrorEvent } from "./catchError";
import { ApiError, NetError } from "./error";
import { BffEventSource } from "./useBffStream";
const apiCallFn = async (path, ...params) => {
    try {
        const requestPath = `${__BFF_API_PATH_PREFIX__}${path.join('/')}`;
        const requestBody = { params, time: new Date().getTime() };
        const resRaw = await fetch(requestPath, {
            method: 'post',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (resRaw.status >= 200 && resRaw.status < 300) {
            const resJson = await resRaw.json();
            if (resJson.error === true) {
                throw new ApiError(resJson.msg, resJson.code, resRaw.status);
            }
            else if (resJson.error === false) {
                return resJson.data;
            }
            else if (resJson._bff_upgrade === 'bff-event-source') {
                const urlQuery = `?params=${encodeURIComponent(JSON.stringify(requestBody.params))}&time=${requestBody.time}`;
                return new BffEventSource(requestPath + urlQuery);
            }
            else {
                throw new Error('请求数据异常！');
            }
        }
        else {
            const msg = `[${resRaw.status}] ${await resRaw.text() || '服务器开小差啦~'}`;
            throw new NetError(msg, resRaw.status);
        }
    }
    catch (e) {
        const error = e instanceof ApiError || e instanceof NetError ? e : new NetError('请求失败...', -1);
        window.dispatchEvent(new BffErrorEvent(error));
        throw error;
    }
};
const bffRequest = new Proxy({}, {
    get(_, key) {
        const path = [key];
        const callFn = apiCallFn.bind(null, path);
        const callChain = new Proxy(callFn, {
            get(_, key) {
                path.push(key);
                return callChain;
            }
        });
        return callChain;
    }
});
export default bffRequest;

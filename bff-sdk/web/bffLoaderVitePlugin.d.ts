export default function bffLoaderVitePlugin(opts: {
    apiDevHost?: string;
    apiDevPort?: number;
    apiDevSchema?: 'http' | 'https';
    /** api 服务的 path 前缀, 默认为 /api/ */
    apiPathPrefix?: string;
    /**
     * controller 对象的 import 名称
     * 例: import aa from 'controllerImportName'
     * aa.xx 的调用会自动转化成 fetch 请求
     *  */
    controllerImportName?: string;
}): {
    name: string;
    config: () => {
        resolve: {
            alias: {
                find: RegExp;
                replacement: string;
            }[];
        };
        define: {
            __BFF_API_PATH_PREFIX__: string;
        };
        server: {
            proxy: {
                [x: string]: {
                    target: string;
                };
            };
        };
    };
};

export default function bffLoaderVitePlugin(opts) {
    const { apiPathPrefix = '/api/', apiDevHost = 'localhost', apiDevPort = 7016, apiDevSchema = 'http', controllerImportName = '@api' } = opts;
    return {
        name: 'bff',
        config: () => ({
            resolve: {
                alias: [{
                        find: new RegExp(`^${controllerImportName}$`),
                        replacement: '@bff-sdk/web/bffRequest'
                    }]
            },
            define: {
                __BFF_API_PATH_PREFIX__: apiPathPrefix,
            },
            server: {
                proxy: {
                    [apiPathPrefix]: {
                        target: `${apiDevSchema}://${apiDevHost}:${apiDevPort}`,
                        changeOrigin: true,
                        // ws: true,
                        configure: (proxy, options) => {
                            // proxy 是 'http-proxy' 的实例
                            proxy.on('proxyReq', (proxyReq, req, res) => {
                                res.on('close', () => {
                                    if (!res.finished)
                                        proxyReq.destroy();
                                });
                            });
                        }
                    }
                }
            }
        }),
    };
}

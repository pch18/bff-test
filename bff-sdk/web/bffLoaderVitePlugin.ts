
export default function bffLoaderVitePlugin(opts: {
  apiDevHost?: string,
  apiDevPort?: number,
  apiDevSchema?: 'http' | 'https'
  /** api 服务的 path 前缀, 默认为 /api/ */
  apiPathPrefix?: string
  /** 
   * controller 对象的 import 名称
   * 例: import aa from 'controllerImportName'
   * aa.xx 的调用会自动转化成 fetch 请求
   *  */
  controllerImportName?: string
}) {
  const {
    apiPathPrefix = '/api/',
    apiDevHost = 'localhost',
    apiDevPort = 7016,
    apiDevSchema = 'http',
    controllerImportName = '@api'
  } = opts

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
            // bypass: (req: any) => {
            //   if (req.method !== 'POST') {
            //     return req.url
            //   }
            // }
          }
        }
      }
    }),
  }
}
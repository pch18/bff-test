
export default function bffLoaderVitePlugin(opts: {
  serverUrl: string
}) {
  return {
    name: 'bff',
    config: () => ({
      resolve: {
        alias: { api: '@bff-sdk/web/bffRequest' }
      },
      server: {
        proxy: {
          '/': {
            target: opts.serverUrl,
            bypass: (req: any) => {
              if (req.method !== 'POST') {
                return req.url
              }
            }
          }
        }
      }
    }),
  }
}
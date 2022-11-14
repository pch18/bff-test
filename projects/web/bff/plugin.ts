import { PluginOption } from "vite"


export default function myPlugin({
  serverUrl
}: {
  serverUrl: string
}): PluginOption {
  return {
    name: 'bff',
    config: () => ({
      resolve: {
        alias: { api: '/bff/api' }
      },
      server: {
        proxy: {
          '/': {
            target: serverUrl,
            bypass: (req) => {
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
import Koa from 'koa'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import koaConnect from 'koa-connect'
import ReactDOMServer from "react-dom/server";

const app = new Koa()
app.listen(8800)

const vite = await createServer({
  root: process.cwd(),
  logLevel: 'error',
  server: {
    middlewareMode: true,
    watch: {
      // During tests we edit the files too fast and sometimes chokidar
      // misses change events, so enforce polling for consistency
      usePolling: true,
      interval: 100,
    },
    // hmr: {
    //   port: hmrPort,
    // },
  },
  appType: 'custom',
})
app.use(koaConnect(vite.middlewares))


app.use(async (ctx, next) => {
  ctx.type = 'text/html; charset=utf-8'
  ctx.status = 200

  const _temp = fs.readFileSync(resolve('index.html'), 'utf-8')
  const temp = await vite.transformIndexHtml(ctx.originalUrl, _temp)
  const { default: entry } = await vite.ssrLoadModule('entry-server.jsx')
  const [temp1, temp2] = temp.split('<!--app-html-->')

  await new Promise((resolve, reject) => {
    const stream = ReactDOMServer.renderToPipeableStream(entry(ctx.originalUrl), {
      onShellReady() {
        ctx.res.write(temp1)
        stream.pipe(ctx.res)
      },
      onAllReady() {
        ctx.res.write(temp2)
        resolve()
      }
    })
  })
  // const appHtml = ReactDOMServer.renderToString(entry(ctx.originalUrl))
  // ctx.body = temp.replace(`<!--app-html-->`, appHtml)
  next()
})

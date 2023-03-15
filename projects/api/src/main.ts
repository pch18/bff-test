import Koa from "koa";
import controller from "./controller";
import { createBffLoader } from "@bff-sdk/api";
import Bodyparser from "koa-bodyparser";

const app = new Koa();

app.use(createBffLoader(controller));

// app.use((ctx, next) => {
//   ctx.body = 'xxx';
//   next()
// })
// const bodyParser = Bodyparser()

// app.use(async (ctx, next) => {
//   await bodyParser(ctx, () => Promise.resolve(undefined))
//   console.log(ctx.request)

//   ctx.body = ctx.request.body
// })

app.listen(7016);

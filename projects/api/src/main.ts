import Koa from 'koa';
import controller from './controller'
import _ from 'lodash'
import { alsRun } from './utils/useCtx';

const app = new Koa()


app.use((ctx) => {
  const callPath = ctx.path.split('/').slice(1)
  const callFn = _.get(controller, callPath)
  alsRun({ ctx }, callFn)
})

app.listen(3000)


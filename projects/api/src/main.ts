import Koa from 'koa';
import controller from './controller'
import _ from 'lodash'
import { createBffLoader } from '@bff-sdk/api'

const app = new Koa()

app.use(createBffLoader(controller))

app.listen(7016)


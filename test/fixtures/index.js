import Koa from 'koa'
import glob from 'glob'
import Body from 'koa-body'
import * as route from 'route'

const views = glob.sync(`${__dirname}/resources/*.js`)

export default class App extends Koa {
  constructor() {
    super()
    this.prefix = '/v1'
    this.use(Body({ multipart: true }))
    route.bind(this, views, { prefix: this.prefix })
  }
}

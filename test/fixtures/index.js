import Koa from 'koa'
import glob from 'glob'
import Body from 'koa-body'
import bcrypt from 'bcrypt'
import * as route from 'route'
import { XSRF } from 'middleware'

const views = glob.sync(`${__dirname}/resources/*.js`)
const secret = bcrypt.hashSync('dekoa', 12)

export default class App extends Koa {
  constructor () {
    super()
    this.prefix = '/v1'
    this.use(Body({ multipart: true }))
    this.use(XSRF(secret))
    route.bind(this, views, { prefix: this.prefix })
  }
}

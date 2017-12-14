import Status from 'http-status-codes'
import { resource, post } from 'route'
import * as schema from '../schema'

@resource('roles')
export class Role {
  @post('/', schema.Role)
  async upload (ctx) {
    const params = ctx.request.body
    ctx.status = Status.CREATED
    ctx.body = params
  }
}

import Status from 'http-status-codes'
import { resource, post } from 'route'
import { form } from 'schema'
import * as schema from '../schema'

@resource('roles')
export class Role {
  @form(schema.Role)
  @post('/')
  async upload (ctx) {
    const params = ctx.request.body
    ctx.status = Status.CREATED
    ctx.body = params
  }
}

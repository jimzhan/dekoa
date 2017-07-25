import Status from 'http-status-codes'
import { resource, post, put, del } from 'route'
import { form } from 'schema'
import { NewAccount } from '../schema'

@resource('schema')
export default class Schema {
  @form(NewAccount)
  @post('/')
  async create(ctx) {
    ctx.status = Status.CREATED
    ctx.body = { username: 'test@example.com' }
  }

  @put('/:id')
  async update (ctx) {
    ctx.status = Status.OK
    ctx.body = { username: 'test@example.com' }
  }

  @del('/:id')
  async remove (ctx) {
    ctx.status = Status.NO_CONTENT
  }
}

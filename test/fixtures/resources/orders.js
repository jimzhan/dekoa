import Status from 'http-status-codes'
import { resource, get, post } from 'route'

@resource('orders')
export default class Account {
  @get('/:id')
  async findById (ctx) {
    ctx.status = Status.OK
    ctx.body = { id: ctx.params.id, status: Status.OK }
  }

  @post('/')
  async create (ctx) {
    const params = ctx.request.body
    ctx.status = Status.CREATED
    ctx.body = params
  }
}

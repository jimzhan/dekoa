import Status from 'http-status-codes'
import { resource, get, post } from 'route'

@resource('accounts')
export default class Account {
  @get('/:id')
  async findById (ctx) {
    ctx.status = Status.OK
    ctx.body = { username: 'test@example.com' }
  }

  @post('/')
  async create (ctx) {
    ctx.status = Status.CREATED
    ctx.body = { username: 'test@example.com' }
  }
}

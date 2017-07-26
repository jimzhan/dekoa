import Status from 'http-status-codes'
import {
  resource,
  get,
  post,
  head,
  options,
  trace,
  patch
} from 'route'

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

  @head('/')
  async head (ctx) {
    ctx.status = Status.OK
  }

  @options('/')
  async options (ctx) {
    ctx.status = Status.OK
  }

  @trace('/')
  async trace (ctx) {
    ctx.status = Status.OK
  }

  @patch('/')
  async patch (ctx) {
    ctx.status = Status.OK
  }
}

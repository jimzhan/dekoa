import Status from 'http-status-codes'
import { resource, post, del } from 'route'

@resource
export default class Account {
  @post('/login')
  async login (ctx) {
    ctx.status = Status.RESET_CONTENT
  }

  @post('/logout')
  async logout (ctx) {
    ctx.status = Status.RESET_CONTENT
  }

  @del('/xsrf')
  async remove (ctx) {
    ctx.status = Status.NO_CONTENT
  }
}

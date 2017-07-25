import Status from 'http-status-codes'
import { resource, post } from 'route'

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
}

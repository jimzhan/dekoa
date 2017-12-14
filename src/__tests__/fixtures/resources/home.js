import Status from 'http-status-codes'
import {
  resource,
  get
} from 'route'

@resource('home')
export default class Home {
  @get('/')
  async echo (ctx) {
    ctx.status = Status.OK
  }
}

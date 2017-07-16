import Status from 'http-status-codes';
import { resource, POST } from 'route';

@resource
export default class Account {
  @POST('/login')
  async login(ctx) {
    ctx.status = Status.RESET_CONTENT;
  }

  @POST('/logout')
  async logout(ctx) {
    ctx.status = Status.RESET_CONTENT;
  }
}

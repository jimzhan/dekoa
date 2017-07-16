import Status from 'http-status-codes';
import { resource, GET, POST } from 'route';

@resource('accounts')
export default class Account {
  @GET('/:id')
  async findById(ctx) {
    ctx.status = Status.OK;
    ctx.body = { username: 'test@example.com' };
  }

  @POST('/')
  async create(ctx) {
    ctx.status = Status.CREATED;
    ctx.body = { username: 'test@example.com' };
  }
}

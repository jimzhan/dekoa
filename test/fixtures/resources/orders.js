import Status from 'http-status-codes';
import { resource, GET, POST } from 'route';

@resource('orders')
export default class Account {
  @GET('/:id')
  async findById(ctx) {
    ctx.status = Status.OK;
    ctx.body = { id: ctx.params.id, status: Status.OK };
  }

  @POST('/')
  async create(ctx) {
    const params = ctx.request.body;
    ctx.status = Status.CREATED;
    ctx.body = params;
  }
}

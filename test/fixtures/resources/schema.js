import Status from 'http-status-codes';
import { resource, post, put, del } from 'route';
import schema from 'schema';


@resource('schema')
export default class Schema {
  @schema(`${__dirname}/schema/NewAccount.json`)
  @post('/')
  async create(ctx) {
    ctx.status = Status.CREATED;
    ctx.body = { username: 'test@example.com' };
  }

  @put('/:id')
  async update(ctx) {
    ctx.status = Status.OK;
    ctx.body = { username: 'test@example.com' };
  }

  @del('/:id')
  async remove(ctx) {
    ctx.status = Status.NO_CONTENT;
  }
}

import Status from 'http-status-codes';
import { resource, POST } from 'route';
import { form } from 'validators';
import * as regex from 'regex';

@resource('inputs')
export default class Input {
  @form({ username: regex.email })
  @POST('/')
  async create(ctx) {
    ctx.status = Status.CREATED;
    ctx.body = { username: 'test@example.com' };
  }
}

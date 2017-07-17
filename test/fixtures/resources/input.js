import Status from 'http-status-codes';
import { resource, POST, PUT, DELETE } from 'route';
import { form } from 'validators';
import * as regex from 'regex';

function isValidEmail(email) {
  console.log(email);
  console.log(regex.email.test(email));
  return regex.email.test(email);
}

@resource('inputs')
export default class Input {
  @form({ username: regex.email })
  @POST('/')
  async create(ctx) {
    ctx.status = Status.CREATED;
    ctx.body = { username: 'test@example.com' };
  }

  @form({ username: isValidEmail })
  @PUT('/:id')
  async update(ctx) {
    ctx.status = Status.OK;
    ctx.body = { username: 'test@example.com' };
  }

  @DELETE('/:id')
  async remove(ctx) {
    ctx.status = Status.NO_CONTENT;
  }
}

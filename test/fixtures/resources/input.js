import Status from 'http-status-codes';
import { resource, post, put, del } from 'route';
import { form } from 'validators';
import * as regex from 'regex';

function isValidEmail(email) {
  return regex.email.test(email);
}

@resource('inputs')
export default class Input {
  @form({ username: regex.email })
  @post('/')
  async create(ctx) {
    ctx.status = Status.CREATED;
    ctx.body = { username: 'test@example.com' };
  }

  @form({ username: isValidEmail })
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

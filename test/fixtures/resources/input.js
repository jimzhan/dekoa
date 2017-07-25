import Status from 'http-status-codes';
import Body from 'koa-body';
import { resource, get, post, put, del, use } from 'route';
import { form, query } from 'validators';
import * as regex from 'regex';

function isValidEmail(email) {
  return regex.email.test(email);
}

@use(Body({ strict: false }))
@resource('inputs')
export default class Input {
  @query({ username: regex.email })
  @get('/')
  async find(ctx) {
    ctx.status = Status.OK;
    ctx.body = [{ username: 'test@example.com' }];
  }

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

  @use(Body({ strict: false }))
  @del('/:id')
  async remove(ctx) {
    ctx.status = Status.NO_CONTENT;
  }
}

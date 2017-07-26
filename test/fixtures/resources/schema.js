import Status from 'http-status-codes'
import { resource, get, post, put, del } from 'route'
import { form, query, validate } from 'schema'
import { NewAccount, UpdateAccount, Finder, Upload } from '../schema'

@resource('schema')
export default class Schema {
  @query(Finder)
  @get('/')
  async find(ctx) {
    const params = ctx.query;
    ctx.status = Status.OK
    ctx.body = { limit: params.limit, offset: params.offset };
  }

  @form(Upload)
  @post('/upload')
  async upload(ctx) {
    ctx.status = Status.CREATED
  }

  @form(NewAccount)
  @post('/')
  async create(ctx) {
    ctx.status = Status.CREATED
    ctx.body = { username: 'test@example.com' }
  }

  @validate(UpdateAccount)
  @put('/:id')
  async update (ctx) {
    ctx.status = Status.OK
    ctx.body = { username: 'test@example.com' }
  }

  @del('/:id')
  async remove (ctx) {
    ctx.status = Status.NO_CONTENT
  }
}

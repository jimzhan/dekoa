import Status from 'http-status-codes'
import { resource, get, post, put, del } from 'route'
import { NewAccount, UpdateAccount, Finder, Upload } from '../schema'

@resource('schema')
export default class Schema {
  @get('/', Finder)
  async find (ctx) {
    const params = ctx.query
    ctx.status = Status.OK
    ctx.body = { limit: params.limit, offset: params.offset }
  }

  @post('/upload', Upload)
  async upload (ctx) {
    ctx.status = Status.CREATED
  }

  @post('/', NewAccount)
  async create (ctx) {
    ctx.status = Status.CREATED
    ctx.body = { username: 'test@example.com' }
  }

  @put('/:id', UpdateAccount)
  async update (ctx) {
    ctx.status = Status.OK
    ctx.body = { username: 'test@example.com' }
  }

  @del('/:id')
  async remove (ctx) {
    ctx.status = Status.NO_CONTENT
  }
}

import Status from 'http-status-codes'
import * as helpers from 'test/helpers'

const url = '/roles'

describe('[roles]', () => {
  beforeEach(async () => {
    await helpers.get('/home').send()
  })

  it('should receive a 422 response on empty request', async () => {
    const response = await helpers.post(url).send()
    expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
  })

  it('should receive a 422 response on invalid request', async () => {
    const response = await helpers.post(url).send({ name: 'test@example.com' })
    expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
  })

  it('should receive a 201 response on valid request', async () => {
    const role = {
      name: 'admin',
      note: 'Administrator',
      perms: {
        action: 'create',
        resource: 'docs'
      }
    }
    const response = await helpers.post(url).send(role)
    expect(response.status).toEqual(Status.CREATED)
    expect(response.body.name).toEqual('admin')
    expect(response.body.note).toEqual('Administrator')
    expect(response.body.perms.action).toEqual('create')
    expect(response.body.perms.resource).toEqual('docs')
  })
})

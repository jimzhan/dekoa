import supertest from 'supertest'
import { expect } from 'chai'
import Status from 'http-status-codes'
import { server } from './fixtures/server'

const request = supertest.agent(server.listen())
const url = '/v1/roles'

describe('[roles]', () => {
  describe(`POST ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await request.post(url).send()
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 422 response on invalid request', async () => {
      const response = await request.post(url).send({ name: 'test@example.com' })
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
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
      const response = await request.post(url).send(role)
      expect(response.status).to.equal(Status.CREATED)
      expect(response.body.name).to.equal('admin')
      expect(response.body.note).to.equal('Administrator')
      expect(response.body.perms.action).to.equal('create')
      expect(response.body.perms.resource).to.equal('docs')
    })
  })
})

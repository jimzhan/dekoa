import supertest from 'supertest'
import { expect } from 'chai'
import Status from 'http-status-codes'
import server from './fixtures/server'

const request = supertest.agent(server.listen())
const url = '/v1/schema/'

describe('[schema]', () => {
  describe(url, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await request.post(url).send()
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    })
  })
})

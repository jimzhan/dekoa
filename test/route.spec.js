import supertest from 'supertest'
import { expect } from 'chai'
import Status from 'http-status-codes'
import { server } from './fixtures/server'

const request = supertest.agent(server.listen())
const urls = {
  accounts: '/v1/accounts'
}

describe('[route]', () => {
  describe(urls.accounts, () => {
    it('should find account name `test@example.com`', async () => {
      const response = await request.get(`${urls.accounts}/123`)
      const account = response.body
      expect(response.status).to.equal(Status.OK)
      expect(account.username).to.equal('test@example.com')
    })

    it('shoud create a new account', async () => {
      const response = await request.post(urls.accounts)
      const account = response.body
      expect(response.status).to.equal(Status.CREATED)
      expect(account.username).to.equal('test@example.com')
    })
  })

  describe(`[Optional Methods] ${urls.accounts}`, () => {
    it('should HTTP::head to Service endpoint', async () => {
      const response = await request.head(urls.accounts)
      expect(response.status).to.equal(Status.OK)
    })

    it('should HTTP::options to Service endpoint', async () => {
      const response = await request.options(urls.accounts)
      expect(response.status).to.equal(Status.OK)
    })

    it('should HTTP::trace to Service endpoint', async () => {
      const response = await request.trace(urls.accounts)
      expect(response.status).to.equal(Status.OK)
    })

    it('should HTTP::patch to Service endpoint', async () => {
      const response = await request.patch(urls.accounts)
      expect(response.status).to.equal(Status.OK)
    })
  })

  describe('/v1/login', () => {
    it('should get a reset content response on login', async () => {
      const response = await request.post('/v1/login')
      expect(response.status).to.equal(Status.RESET_CONTENT)
    })
  })

  describe('/v1/logout', () => {
    it('should get a reset content response on logout', async () => {
      const response = await request.post('/v1/logout')
      expect(response.status).to.equal(Status.RESET_CONTENT)
    })
  })

  describe('/v1/orders', () => {
    it('should find the order with given id', async () => {
      const response = await request.get('/v1/orders/123')
      const order = response.body
      expect(response.status).to.equal(Status.OK)
      expect(order.id).to.equal('123')
    })

    it('should create a new order', async () => {
      const response = await request.post('/v1/orders/').send({ id: 123, name: 'new' })
      const order = response.body
      expect(response.status).to.equal(Status.CREATED)
      expect(order.id).to.equal(123)
      expect(order.name).to.equal('new')
    })
  })
})

import Status from 'http-status-codes'
import * as helpers from 'test/helpers'

const urls = {
  accounts: '/accounts'
}
let token

describe('[route]', () => {
  beforeEach(async () => {
    token = await helpers.fetchXsrfToken()
  })

  describe(urls.accounts, () => {
    it('should find account name `test@example.com`', async () => {
      const response = await helpers.get(`${urls.accounts}/123`).send()
      const account = response.body
      expect(response.status).toEqual(Status.OK)
      expect(account.username).toEqual('test@example.com')
    })

    it('shoud create a new account', async () => {
      const response = await helpers.post(urls.accounts).set(helpers.XSRF, token).send()
      const account = response.body
      expect(response.status).toEqual(Status.CREATED)
      expect(account.username).toEqual('test@example.com')
    })
  })

  describe(`[Optional Methods] ${urls.accounts}`, () => {
    it('should HTTP::head to Service endpoint', async () => {
      const response = await helpers.head(urls.accounts).send()
      expect(response.status).toEqual(Status.OK)
    })

    it('should HTTP::options to Service endpoint', async () => {
      const response = await helpers.options(urls.accounts).send()
      expect(response.status).toEqual(Status.OK)
    })

    it('should HTTP::trace to Service endpoint', async () => {
      const response = await helpers.trace(urls.accounts).send()
      expect(response.status).toEqual(Status.OK)
    })

    it('should HTTP::patch to Service endpoint', async () => {
      const response = await helpers.patch(urls.accounts).set(helpers.XSRF, token).send()
      expect(response.status).toEqual(Status.OK)
    })
  })

  describe('/v1/login', () => {
    it('should get a reset content response on login', async () => {
      const response = await helpers.post('/login').set(helpers.XSRF, token).send()
      expect(response.status).toEqual(Status.RESET_CONTENT)
    })
  })

  describe('/v1/logout', () => {
    it('should get a reset content response on logout', async () => {
      const response = await helpers.post('/logout').set(helpers.XSRF, token).send()
      expect(response.status).toEqual(Status.RESET_CONTENT)
    })
  })

  describe('/v1/orders', () => {
    it('should find the order with given id', async () => {
      const response = await helpers.get('/orders/123').send()
      const order = response.body
      expect(response.status).toEqual(Status.OK)
      expect(order.id).toEqual('123')
    })

    it('should create a new order', async () => {
      const response = await helpers.post('/orders/').set(helpers.XSRF, token).send({ id: 123, name: 'new' })
      const order = response.body
      expect(response.status).toEqual(Status.CREATED)
      expect(order.id).toEqual(123)
      expect(order.name).toEqual('new')
    })
  })
})

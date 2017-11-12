import Status from 'http-status-codes'
import * as helpers from 'test/helpers'

const url = '/xsrf'

describe('[XSRF Token]', () => {
  beforeEach(async () => {
    await helpers.get('/home').send()
  })

  it('should receive a 204 response on empty request', async () => {
    const response = await helpers.del(url).send()
    expect(response.status).toEqual(Status.NO_CONTENT)
  })

  it('should recieve a 403 response on invalid XSRF token', async () => {
    const response = await helpers.del(url).set('Cookie', 'xsrftoken=23423432').send()
    expect(response.status).toEqual(Status.FORBIDDEN)
  })
})

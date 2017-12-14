import Status from 'http-status-codes'
import * as helpers from '../helpers'

const url = '/xsrf'

describe('[XSRF Token]', () => {
  it('should receive a 204 response on empty request', async () => {
    const token = await helpers.fetchXsrfToken()
    const response = await helpers.del(url).set(helpers.XSRF, token).send()
    expect(response.status).toEqual(Status.NO_CONTENT)
  })

  it('should recieve a 403 response on invalid XSRF token', async () => {
    const response = await helpers.del(url).send()
    expect(response.status).toEqual(Status.FORBIDDEN)
  })
})

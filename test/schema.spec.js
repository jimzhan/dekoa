import Status from 'http-status-codes'
import * as helpers from 'test/helpers'

const url = '/schema/'

describe('[schema]', () => {
  describe(`GET ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await helpers.get(url).send()
      expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 200 response on valid request', async () => {
      const response = await helpers.get(url)
        .query({ offset: 100, limit: 100 })
        .set('Content-Type', 'application/json')
        .send()
      expect(response.status).toEqual(Status.OK)
    })
  })

  const upload = `${url}upload`
  describe(`[POST][multipart] ${upload}`, () => {
    it('should receive a 422 response on empty upload', async () => {
      const response = await helpers.post(upload)
        .field('filename', 'a')
        .attach('LICENSE', `${__dirname}/../LICENSE`)
      expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 200 response on valid upload', async () => {
      const response = await helpers.post(upload)
        .field('filename', 'abc.txt')
        .attach('LICENSE', `${__dirname}/../LICENSE`)
      expect(response.status).toEqual(Status.CREATED)
    })
  })

  describe(`POST ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await helpers.post(url).send()
      expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 201 response on valid request', async () => {
      const response = await helpers.post(url).send({
        username: 'test@example.com',
        password: 'abcdefg'
      })
      expect(response.status).toEqual(Status.CREATED)
    })
  })

  describe(`PUT ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await helpers.put(`${url}123`).send()
      expect(response.status).toEqual(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 200 response on valid request', async () => {
      const response = await helpers.put(`${url}123`).send({ password: 'fdsfdsfds' })
      expect(response.status).toEqual(Status.OK)
      expect(response.body.username).toEqual('test@example.com')
    })
  })
})

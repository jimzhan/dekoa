import supertest from 'supertest'
import { expect } from 'chai'
import Status from 'http-status-codes'
import { server, serverWithoutBody } from './fixtures/server'

const request = supertest.agent(server.listen())
const url = '/v1/schema/'

describe('[schema]', () => {
  describe(`GET ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await request.get(url).send()
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    });

    it('should receive a 200 response on valid request', async () => {
      const response = await request.get(url)
        .query({ offset: 100, limit: 100 })
        .set('Content-Type', 'application/json')
        .send()
      expect(response.status).to.equal(Status.OK)
    });
  });

  const upload = `${url}upload`
  describe(`[POST][multipart] ${upload}`, () => {
    it('should receive a 422 response on empty upload', async () => {
      const response = await request
        .post(upload)
        .field('filename', 'a')
        .attach('LICENSE', `${__dirname}/../LICENSE`)
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    });

    it('should receive a 200 response on valid upload', async () => {
      const response = await request
        .post(upload)
        .field('filename', 'abc.txt')
        .attach('LICENSE', `${__dirname}/../LICENSE`)
      expect(response.status).to.equal(Status.CREATED)
    });
  });

  describe(`POST ${url}`, () => {
    it('should receive a 500 response on Server without koa-body', async () => {
      const request = supertest.agent(serverWithoutBody.listen())
      const response = await request.post(url).send()
      expect(response.status).to.equal(Status.INTERNAL_SERVER_ERROR)
    });

    it('should receive a 422 response on empty request', async () => {
      const response = await request.post(url).send()
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    })

    it('should receive a 201 response on valid request', async () => {
      const response = await request.post(url).send({
        username: 'test@example.com',
        password: 'abcdefg'
      })
      expect(response.status).to.equal(Status.CREATED)
    })
  })

  describe(`PUT ${url}`, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await request.put(`${url}123`).send()
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY)
    });

    it('should receive a 200 response on valid request', async () => {
      const response = await request.put(`${url}123`).send({ password: 'fdsfdsfds' })
      expect(response.status).to.equal(Status.OK)
      expect(response.body.username).to.equal('test@example.com')
    });
  })
})

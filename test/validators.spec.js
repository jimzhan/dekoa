import debug from 'debug';
import supertest from 'supertest';
import { expect } from 'chai';
import Status from 'http-status-codes';
import server from './fixtures/server';

// eslint-disable-next-line
const log = debug('{test.spec}');
const request = supertest.agent(server.listen());
const url = '/v1/inputs/';

describe('[validators]', () => {
  describe(url, () => {
    it('should receive a 422 response on empty request', async () => {
      const response = await request.post(url).send();
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY);
    });

    it('should receive a 422 response on invalid username parameter', async () => {
      const response = await request.post(url).send({ username: 'valid@example.' });
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY);
    });

    it('should receive a 422 response on invalid username query', async () => {
      const response = await request.get(url).query({ username: 'invalid@example.' });
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY);
    });

    it('should be 200 response on valid query', async () => {
      const response = await request.get(url).query({ username: 'valid@example.com' });
      expect(response.status).to.equal(Status.OK);
    });

    it('should receive 422 response on function based validation', async () => {
      const response = await request.put(`${url}123`).send({ username: 'invalid@example' });
      expect(response.status).to.equal(Status.UNPROCESSABLE_ENTITY);
    });

    it('should be 201 response on valid input', async () => {
      const response = await request.post(url).send({ username: 'valid@example.com' });
      expect(response.status).to.equal(Status.CREATED);
    });

    it('should delete an existing input', async () => {
      const response = await request.del(`${url}123`);
      expect(response.status).to.equal(Status.NO_CONTENT);
    });
  });
});

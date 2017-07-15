import debug from 'debug';
import supertest from 'supertest';
import { expect } from 'chai';
import Status from 'http-status-codes';
import server from './fixtures/server';

// eslint-disable-next-line
const log = debug('{test.spec}');
const request = supertest.agent(server.listen());

describe('[spec][route]', () => {
  describe('/v1/accounts', () => {
    it('should find account name `test@example.com`', async () => {
      const response = await request.get('/v1/accounts/123');
      const account = response.body;
      expect(response.status).to.equal(Status.OK);
      expect(account.username).to.equal('test@example.com');
    });

    it('shoud create a new account', async () => {
      const response = await request.post('/v1/accounts/');
      const account = response.body;
      expect(response.status).to.equal(Status.CREATED);
      expect(account.username).to.equal('test@example.com');
    });
  });

  describe('/v1/login', () => {
    it('should get a reset content response on login', async () => {
      const response = await request.post('/v1/login');
      expect(response.status).to.equal(Status.RESET_CONTENT);
    });
  });

  describe('/v1/logout', () => {
    it('should get a reset content response on logout', async () => {
      const response = await request.post('/v1/logout');
      expect(response.status).to.equal(Status.RESET_CONTENT);
    });
  });

  describe('/v1/orders', () => {
    it('should find the order with given id', async () => {
      const response = await request.get('/v1/orders/123');
      const order = response.body;
      expect(response.status).to.equal(Status.OK);
      expect(order.id).to.equal('123');
    });

    it('shoud create a new order', async () => {
      const response = await request.post('/v1/orders/').send({ id: 123, name: 'new' });
      const order = response.body;
      expect(response.status).to.equal(Status.CREATED);
      expect(order.id).to.equal(123);
      expect(order.name).to.equal('new');
    });
  });
});

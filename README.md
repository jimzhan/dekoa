# dekoa - Decorators for Koa with :revolving_hearts:

[![build](https://travis-ci.org/jimzhan/dekoa.svg?branch=master)](https://travis-ci.org/jimzhan/dekoa)
[![Coverage Status](https://coveralls.io/repos/github/jimzhan/dekoa/badge.svg?branch=master)](https://coveralls.io/github/jimzhan/dekoa?branch=master)
[![npm version](https://img.shields.io/npm/v/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![npm downloads](https://img.shields.io/npm/dm/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![dependencies](https://david-dm.org/jimzhan/dekoa.svg)](https://david-dm.org/jimzhan/dekoa.svg)


Handy decorators dedicated for Koa, batteris included:
*  Class based routes supports.

## Installation

```bash
npm install dekoa
```

## Decorators

* route.js#bind(server, pattern, options)

  - assuming we have all the view controllers under `src/resources/`.

    ```js
    // src/server.js
    import Koa from 'koa'
    import debug from 'debug';
    import { route } from 'dekoa'

    const log = debug('debug');
    const server = new Koa();

    // all of the view controllers defined in `src/resources` will be automatically registered.
    route.bind(server, `${__dirname}/resources/*.js`, { prefix: '/v1' });

    const port = process.env.PORT || 9394;
    server.listen(port, () => {
      log(`Server started at port: ${port}`);
    });
    ```

  - sample view controllers with decorators supports.

    ```js
    // src/resources/accounts.js
    import Status from 'http-status-codes';
    import { resource, GET, POST } from 'dekoa';

    @resource('accounts')
    export default class Account {
      @GET('/:id')
      async findById(ctx) {
        const params = ctx.params;
        ctx.status = Status.OK;
        ctx.body = { id: params.id, username: 'test@example.com' };
      }

      @POST('/')
      async create(ctx) {
        ctx.status = Status.CREATED;
        ctx.body = { username: 'test@example.com' };
      }
    }
    ```

    ```js
    import Status from 'http-status-codes';
    import { resource, POST } from 'dekoa';

    // `resource` decorator without prefix will be inject as top level URL.
    @resource
    export default class Auth {
      @POST('/login')
      async login(ctx) {
        ctx.status = Status.RESET_CONTENT;
      }

      @POST('/logout')
      async logout(ctx) {
        ctx.status = Status.RESET_CONTENT;
      }
    }
    ```

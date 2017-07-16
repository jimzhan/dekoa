# dekoa - Decorators for Koa with :revolving_hearts:

[![Node.js Version][node-image]][node-url]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Dependency Status][dep-image]][dep-url]
[![Coverage Status][cov-img]][cov-url]
[![npm downloads](https://img.shields.io/npm/dm/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)

Supported [Koa](https://github.com/koajs/koa) >= v2.0.

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
    import { resource, GET, POST } from 'dekoa/route';

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
    import { resource, POST } from 'dekoa/route';

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


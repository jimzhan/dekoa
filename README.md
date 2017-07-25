# dekoa - Decorators for Koa with :revolving_hearts:

[![build](https://travis-ci.org/jimzhan/dekoa.svg?branch=master)](https://travis-ci.org/jimzhan/dekoa)
[![npm version](https://img.shields.io/npm/v/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![npm downloads](https://img.shields.io/npm/dm/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![dependencies](https://david-dm.org/jimzhan/dekoa.svg)](https://david-dm.org/jimzhan/dekoa.svg)


Handy decorators dedicated for Koa, batteris included:
* Class based routes supports (full HTTP method supports, [RFC7231](https://tools.ietf.org/html/rfc7231#section-4)).
* [JSON Schema](http://json-schema.org/) based validators (`form`, `query`, `path`).

## Installation

```bash
npm install dekoa
```

## Decorators

* route.js#bind(server, pattern, options)

  - assuming we have all the view controllers under `src/resources/`.

  ```javascript
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

  ```javascript
  // src/resources/accounts.js
  import Status from 'http-status-codes';
  import { resource, get, post } from 'dekoa';

  @resource('accounts')
  export default class Account {
    @get('/:id')
    async findById(ctx) {
      const params = ctx.params;
      ctx.status = Status.OK;
      ctx.body = { id: params.id, username: 'test@example.com' };
    }

    @post('/')
    async create(ctx) {
      ctx.status = Status.CREATED;
      ctx.body = { username: 'test@example.com' };
    }
  }
  ```

  ```javascript
  import Status from 'http-status-codes';
  import { resource, post } from 'dekoa';

  // `resource` decorator without prefix will be injected as top level URL.
  @resource
  export default class Auth {
    @post('/login')
    async login(ctx) {
      ctx.status = Status.RESET_CONTENT;
    }

    @post('/logout')
    async logout(ctx) {
      ctx.status = Status.RESET_CONTENT;
    }
  }
  ```

* JSON Schema, e.g. `NewAccount.json`.

  ```javascript
  {
    "properties": {
      "username": {
        "type": "string",
        "format": "email",
        "minLength": 5,
        "maxLength": 255
      },
      "password": {
        "type": "string",
        "minLength": 6,
        "maxLength": 20
      }
    },
    "required": ["username", "password"]
  }
  ```

* validators.js#form(<Schema>)

  ```javascript
  const NewAccount = require('./NewAccount.json')

  @resource('inputs')
  export default class Input {
    @form(NewAccount)
    @post('/')
    async create(ctx) {
      ctx.status = Status.CREATED;
      ctx.body = { username: 'test@example.com' };
    }
  }
  ```

* validators.js#query(<Schema>)

  ```javascript
  const Account = require('./Account.json')

  @resource('inputs')
  export default class Input {
    @query(Account)
    @post('/')
    async create(ctx) {
      ctx.status = Status.CREATED;
      ctx.body = { username: 'test@example.com' };
    }
  }
  ```

## Regular Expression Helpers

- `dekoa.regex.chinese` - chinese characters.
- `dekoa.regex.email` - email address.
- `dekoa.regex.password` - valid password (>= 6 bits, includes at least 1 lower & 1 upper letter, 1 number & 1 special character).
- `dekoa.regex.integer` - positive/negative integer.
- `dekoa.regex.number` - positive/negative number.
- `dekoa.regex.url` - http/ftp/file address.
- `dekoa.regex.ipv4` - IP address version 4.


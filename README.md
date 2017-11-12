# dekoa - Decorators for Koa with :revolving_hearts:

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![build](https://travis-ci.org/jimzhan/dekoa.svg?branch=master)](https://travis-ci.org/jimzhan/dekoa)
[![codecov](https://codecov.io/gh/jimzhan/dekoa/branch/master/graph/badge.svg)](https://codecov.io/gh/jimzhan/dekoa)
[![npm version](https://img.shields.io/npm/v/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![npm downloads](https://img.shields.io/npm/dm/dekoa.svg?style=flat-square)](https://www.npmjs.com/package/dekoa)
[![dependencies](https://david-dm.org/jimzhan/dekoa.svg)](https://david-dm.org/jimzhan/dekoa.svg)


Handy decorators dedicated for Koa, batteris included:
* Class based routes supports (full HTTP method supports, [RFC7231](https://tools.ietf.org/html/rfc7231#section-4)).
* [JSON Schema](http://json-schema.org/) based validators (via [koa-body](https://github.com/dlau/koa-body)).

## Installation

```bash
npm install dekoa
```

## Decorators

* route.js#bind(server, files, options)

  - assuming we have all the view controllers under `src/resources/`.

  ```javascript
  // src/server.js
  import Koa from 'koa'
  import glob from 'glob'
  import debug from 'debug'
  import { route } from 'dekoa'

  const log = debug('debug')
  const server = new Koa()

  // all of the view controllers defined in `src/resources` will be automatically registered.
  const views = glob.sync(`${__dirname}/resources/*.js`)
  route.bind(server, views, { prefix: '/v1' })

  const port = process.env.PORT || 9394;
  server.listen(port, () => {
    log(`Server started at port: ${port}`)
  })
  ```

  - sample view controllers with decorators supports.

  ```javascript
  // src/resources/accounts.js
  import Status from 'http-status-codes'
  import { resource, get, post } from 'dekoa'

  @resource('accounts')
  export default class Account {
    @get('/:id')
    async findById(ctx) {
      const params = ctx.params
      ctx.status = Status.OK
      ctx.body = { id: params.id, username: 'test@example.com' }
    }

    @post('/')
    async create(ctx) {
      ctx.status = Status.CREATED
      ctx.body = { username: 'test@example.com' }
    }
  }
  ```

  ```javascript
  import Status from 'http-status-codes'
  import { resource, post } from 'dekoa'

  // `resource` decorator without prefix will be injected as top level URL.
  @resource
  export default class Auth {
    @post('/login')
    async login(ctx) {
      ctx.status = Status.RESET_CONTENT
    }

    @post('/logout')
    async logout(ctx) {
      ctx.status = Status.RESET_CONTENT
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

* validate incoming form data

  ```javascript
  const NewAccount = require('./NewAccount.json')

  @resource('inputs')
  export default class Input {
    @post('/', NewAccount)
    async create(ctx) {
      ctx.status = Status.CREATED
      ctx.body = { username: 'test@example.com' }
    }
  }
  ```

* validate incoming http query (`GET`|`HEAD`|`DELETE` ONLY)

  ```javascript
  const Account = require('./Account.json')

  @resource('inputs')
  export default class Input {
    @get('/', Account)
    async find(ctx) {
      ctx.status = Status.OK 
      ctx.body = { username: 'test@example.com' }
    }
  }
  ```

## Middlewares

* XSRF (aka. CSRF) - built on top of [CSRF](https://www.npmjs.com/package/csrf), set for SPA without `session` dependency via cookie and header. Available options:
  - `xsrfCookieName` - cookie name for saving XSRF token (default `xsrftoken`).
  - `xsrfHeaderName` - http header name for responsing XSRF token, value is same as cookie's one (default `X-XSRF-Token`).
  - `invalidTokenMessage` - error message responded for client (default `Invalid XSRF Token`).
  - `invalidTokenStatusCode` - error http status code responded for client (default `403`).
  - `excludedMethods` - methods bypass for XSRF token checking (default `[ 'GET', 'HEAD', 'OPTIONS' ]`).

```javascript
import Koa from 'koa'
import { XSRF } from 'dekoa/middleware'

const server = new Koa()
server.use(XSRF('<my-app-secret>'))
server.listen(port, () => {
  log(`Server started at port: ${port}`)
})
```


## Regular Expression Helpers

- `dekoa.regex.chinese` - chinese characters.
- `dekoa.regex.email` - email address.
- `dekoa.regex.password` - valid password (>= 6 bits, includes at least 1 lower & 1 upper letter, 1 number & 1 special character).
- `dekoa.regex.integer` - positive/negative integer.
- `dekoa.regex.number` - positive/negative number.
- `dekoa.regex.url` - http/ftp/file address.
- `dekoa.regex.ipv4` - IP address version 4.

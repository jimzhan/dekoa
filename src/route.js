const Ajv = require('ajv')
const posix = require('path').posix
const Router = require('koa-router')
const Status = require('http-status-codes')
const { NS, log, kwargs, meta } = require('./private')

const ajv = new Ajv()
/**
 * Find all declared subroutes & bind them into class's descriptor.
 * @param {Class} target resource class to be bound.
 * @param {String} prefix URL prefix for resource.
 */
const bindClassRoutes = (target, prefix = '/') => {
  const routes = []
  const subroutes = meta.get(target, NS.routes) || []
  Object.values(subroutes).forEach((item) => {
    const route = Object.assign(item, {
      pattern: prefix ? posix.join(prefix, item.pattern) : item.pattern
    })
    routes.push(route)
    log(`${route.method.toUpperCase()}\t${route.method.length <= 4 ? '\t' : ''}${route.pattern}`)
  })
  meta.set(target, NS.routes, routes)
}

/**
 * Register all function under Class.prototype's value with the following values:
 *  {
 *    method: '<HEAD | GET | POST | PUT | PATCH | DELETE>',
 *    pattern: 'path-pattern-here',
 *    view: 'string' => function name.
 *    middleware: list of middleware.
 *  }
 * --------------------------------------------------------------------------------
 * Validate incoming HTTP 
 *  - form data .
 *  - query parameter (if ctx.method is GET|HEAD|DELETE).
 * using predefine JSON schema.
 * --------------------------------------------------------------------------------
 * *NOTE* Form data submitted by file load (`multipart`) supported.
 * --------------------------------------------------------------------------------
 * @param {String} method HTTP method.
 * @param {String} pattern HTTP request pattern/path.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const map = (method, pattern, schema = null) => {
  const decorator = (target, name, descriptor) => {
    // route registering.
    const routes = meta.get(target, NS.routes) || []
    routes.push({ method, pattern, view: name })
    meta.set(target, NS.routes, routes)
    // JSON schema based validation.
    if (schema) {
      const runner = async (ctx, next) => {
        const validate = ajv.compile(schema)
        const errors = validate(kwargs(ctx)) ? null : validate.errors
        if (errors) {
          const message = ajv.errorsText(validate.errors)
          log(message)
          ctx.throw(Status.UNPROCESSABLE_ENTITY, message)
        }
        await descriptor.value.apply(target, [ctx, next])
      }
      return meta.describe(descriptor, runner)
    }
    return descriptor
  }
  return decorator
}

/**
 * Class level decorator to help consolidate all functions inside group together.
 * @param {String} prefix resource URL prefix.
 * ```
 * @resource
 * class User {
 *    ...
 * }
 *
 * @resource('accounts')
 * class Account {
 *    ...
 * }
 * ```
 *
 * @returns - Optional returned regular decorator for initialized resource (with URL prefix).
 */
const resource = (obj) => {
  if (meta.isClass(obj)) {
    bindClassRoutes(obj, '/')
    return
  }
  const decorator = (target, name, descriptor) => {
    const prefix = typeof obj === 'string' ? obj : '/'
    bindClassRoutes(target, posix.join('/', prefix))
    return descriptor
  }
  return decorator
}

/**
 * The GET method requests a representation of the specified resource.
 * Requests using GET should only retrieve data.
 * @param {String} pattern GET resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const get = (pattern, schema = null) => map('get', pattern, schema)

/**
 * The HEAD method asks for a response identical to that of a GET request,
 * but without the response body.
 * @param {String} pattern HEAD resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const head = (pattern, schema = null) => map('head', pattern, schema)

/**
 * The POST method is used to submit an entity to the specified resource,
 * often causing a change in state or side effects on the server
 * @param {String} pattern POST resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const post = (pattern, schema = null) => map('post', pattern, schema)

/**
 * The PUT method replaces all current representations of the target
 * resource with the request payload.
 * @param {String} pattern PUT resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const put = (pattern, schema = null) => map('put', pattern, schema)

/**
 * The DELETE method deletes the specified resource.
 * @param {String} pattern DELETE resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const del = (pattern, schema = null) => map('delete', pattern, schema)

/**
 * The OPTIONS method is used to describe the communication options for the target resource.
 * @param {String} pattern OPTIONS resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const options = (pattern, schema = null) => map('options', pattern, schema)

/**
 * The TRACE method performs a message loop-back test along the path to the target resource.
 * @param {String} pattern TRACE resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const trace = (pattern, schema = null) => map('trace', pattern, schema)

/**
 * The PATCH method is used to apply partial modifications to a resource.
 * @param {String} pattern PATCH resource URL pattern.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const patch = (pattern, schema = null) => map('patch', pattern, schema)

/**
 * Search and register all available class view handerls to Koa instance.
 * @param {Object} server Koa instance.
 * @param {Array} files list of paths to view handlers..
 * @param {Object} options detailed settings (incl. root prefix).
 */
const bind = (server, files, options = {}) => {
  const router = options.prefix ? new Router({ prefix: options.prefix }) : new Router()

  Object.values(files).forEach((abspath) => {
    const views = Object.values(require(abspath)).filter(meta.isClass)
    Object.values(views).forEach((Class) => {
      const subroutes = meta.get(Class, NS.routes)
      const instance = new Class()
      Object.values(subroutes).forEach((route) => {
        const handler = instance[route.view]
        router[route.method](route.view, route.pattern, handler)
      })
    })
  })
  server.use(router.routes()).use(router.allowedMethods())
}

module.exports = {
  resource,
  get,
  head,
  post,
  put,
  del,
  options,
  trace,
  patch,
  bind
}

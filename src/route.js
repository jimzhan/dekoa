const glob = require('glob')
const posix = require('path').posix
const Router = require('koa-router')
const { NS, log, meta } = require('./private')

/**
 * Find all declared subroutes & bind them into class's descriptor.
 * @param {Class} target resource class to be bound.
 * @param {String} prefix URL prefix for resource.
 */
function bindClassRoutes (target, prefix = '/') {
  const routes = []
  const subroutes = meta.get(target, NS.routes) || []
  Object.values(subroutes).forEach((item) => {
    const route = Object.assign(item, {
      pattern: prefix ? posix.join(prefix, item.pattern) : item.pattern
    })
    routes.push(route)
    log(`${route.method.toUpperCase()} \t ${route.pattern}`)
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
 * @param {String} method HTTP method.
 * @param {String} pattern HTTP request pattern/path.
 */
function map (method, pattern) {
  const decorator = (target, name, descriptor) => {
    const routes = meta.get(target, NS.routes) || []
    routes.push({ method, pattern, view: name })
    meta.set(target, NS.routes, routes)
    return descriptor
  }
  return decorator
}

module.exports = {
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
  resource (obj) {
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
  },

  /**
   * The GET method requests a representation of the specified resource.
   * Requests using GET should only retrieve data.
   * @param {String} pattern GET resource URL pattern.
   */
  get (pattern) {
    return map('get', pattern)
  },

  /**
   * The HEAD method asks for a response identical to that of a GET request,
   * but without the response body.
   * @param {String} pattern HEAD resource URL pattern.
   */
  head (pattern) {
    return map('head', pattern)
  },

  /**
   * The POST method is used to submit an entity to the specified resource,
   * often causing a change in state or side effects on the server
   * @param {String} pattern POST resource URL pattern.
   */
  post (pattern) {
    return map('post', pattern)
  },

  /**
   * The PUT method replaces all current representations of the target
   * resource with the request payload.
   * @param {String} pattern PUT resource URL pattern.
   */
  put (pattern) {
    return map('put', pattern)
  },

  /**
   * The DELETE method deletes the specified resource.
   * @param {String} pattern DELETE resource URL pattern.
   */
  del (pattern) {
    return map('delete', pattern)
  },

  /**
   * The OPTIONS method is used to describe the communication options for the target resource.
   * @param {String} pattern OPTIONS resource URL pattern.
   */
  options (pattern) {
    return map('options', pattern)
  },

  /**
   * The TRACE method performs a message loop-back test along the path to the target resource.
   * @param {String} pattern TRACE resource URL pattern.
   */
  trace (pattern) {
    return map('trace', pattern)
  },

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   * @param {String} pattern PATCH resource URL pattern.
   */
  patch (pattern) {
    return map('patch', pattern)
  },

  /**
   * Search and register all available class view handerls to Koa instance.
   * @param {Object} server Koa instance.
   * @param {String} pattern string pattern for glob to search view (class) handlers.
   * @param {Object} options detailed settings (incl. root prefix).
   */
  bind (server, pattern, options = {}) {
    const paths = glob.sync(pattern)
    const router = options.prefix ? new Router({ prefix: options.prefix }) : new Router()

    Object.values(paths).forEach((abspath) => {
      // eslint-disable-next-line
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
}

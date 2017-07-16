import debug from 'debug';
import glob from 'glob';
import { posix } from 'path';
import Router from 'koa-router';
import { NS, meta } from './private';

const log = debug('{route}');

/**
 * Find all declared subroutes & bind them into class's descriptor. 
 * @param {Class} target resource class to be bound.
 * @param {String} prefix URL prefix for resource.
 */
const bindClassRoutes = (target, prefix = '/') => {
  const routes = [];
  const subroutes = meta.get(target, NS.routes) || [];
  Object.values(subroutes).forEach((item) => {
    const route = {
      view: item.view,
      method: item.method,
      pattern: prefix ? posix.join(prefix, item.pattern) : item.pattern,
    };
    routes.push(route);
    log(`${route.method.toUpperCase()}\t${route.pattern}`);
  });
  meta.set(target, NS.routes, routes);
};

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
export const resource = (obj) => {
  if (meta.isClass(obj)) {
    bindClassRoutes(obj, '/');
    return;
  }
  const decorator = (target, name, descriptor) => {
    const prefix = typeof obj === 'string' ? obj : '/';
    bindClassRoutes(target, posix.join('/', prefix));
    return descriptor;
  };
  // eslint-disable-next-line
  return decorator;
};

/**
 * Register all function under Class.prototype's value with the following values:
 *  {
 *    method: '<HEAD | GET | POST | PUT | PATCH | DELETE>',
 *    pattern: 'path-pattern-here',
 *    view: '<Object>'
 *  }
 * @param {String} method HTTP method.
 * @param {String} pattern HTTP request pattern/path.
 */
const map = (method, pattern) => {
  const decorator = (target, name, descriptor) => {
    const routes = meta.get(target, NS.routes) || [];
    routes.push({ method, pattern, view: name });
    meta.set(target, NS.routes, routes);
    return descriptor;
  };
  return decorator;
};

/**
 * @param {String} pattern GET resource URL pattern.
 */
export function GET(pattern) {
  return map('get', pattern);
}

/**
 * @param {String} pattern POST resource URL pattern.
 */
export function POST(pattern) {
  return map('post', pattern);
}

/**
 * @param {String} pattern PUT resource URL pattern.
 */
export function PUT(pattern) {
  return map('put', pattern);
}

/**
 * @param {String} pattern DELETE resource URL pattern.
 */
export function DELETE(pattern) {
  return map('delete', pattern);
}


/**
 * Search and register all available class view handerls to Koa instance. 
 * @param {Object} server Koa instance.
 * @param {String} pattern string pattern for glob to search view (class) handlers.
 * @param {Object} options detailed settings (incl. root prefix).
 */
export const bind = (server, pattern, options = {}) => {
  const paths = glob.sync(pattern);
  const router = options.prefix ? new Router({ prefix: options.prefix }) : new Router();

  Object.values(paths).forEach((abspath) => {
    // eslint-disable-next-line
    const views = Object.values(require(abspath)).filter(meta.isClass);
    Object.values(views).forEach((Class) => {
      const subroutes = meta.get(Class, NS.routes);
      const instance = new Class();
      Object.values(subroutes).forEach((route) => {
        router[route.method](route.view, route.pattern, instance[route.view]);
      });
    });
  });
  server.use(router.routes()).use(router.allowedMethods());
};

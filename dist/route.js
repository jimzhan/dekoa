'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = exports.resource = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

exports.GET = GET;
exports.POST = POST;
exports.PUT = PUT;
exports.DELETE = DELETE;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _private = require('./private');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _debug2.default)('{route}');

const bindClassRoutes = (target, prefix = '/') => {
  const routes = [];
  const subroutes = _private.meta.get(target, _private.NS.routes) || [];
  (0, _values2.default)(subroutes).forEach(item => {
    const route = {
      view: item.view,
      method: item.method,
      pattern: prefix ? _path.posix.join(prefix, item.pattern) : item.pattern
    };
    routes.push(route);
    log(`${route.method.toUpperCase()}\t${route.pattern}`);
  });
  _private.meta.set(target, _private.NS.routes, routes);
};

const resource = exports.resource = obj => {
  if (_private.meta.isClass(obj)) {
    bindClassRoutes(obj, '/');
    return;
  }
  const decorator = (target, name, descriptor) => {
    const prefix = typeof obj === 'string' ? obj : '/';
    bindClassRoutes(target, _path.posix.join('/', prefix));
    return descriptor;
  };

  return decorator;
};

const map = (method, pattern) => {
  const decorator = (target, name, descriptor) => {
    const routes = _private.meta.get(target, _private.NS.routes) || [];
    routes.push({ method, pattern, view: name });
    _private.meta.set(target, _private.NS.routes, routes);
    return descriptor;
  };
  return decorator;
};

function GET(pattern) {
  return map('get', pattern);
}

function POST(pattern) {
  return map('post', pattern);
}

function PUT(pattern) {
  return map('put', pattern);
}

function DELETE(pattern) {
  return map('delete', pattern);
}

const bind = exports.bind = (server, pattern, options = {}) => {
  const paths = _glob2.default.sync(pattern);
  const router = options.prefix ? new _koaRouter2.default({ prefix: options.prefix }) : new _koaRouter2.default();

  (0, _values2.default)(paths).forEach(abspath => {
    const views = (0, _values2.default)(require(abspath)).filter(_private.meta.isClass);
    (0, _values2.default)(views).forEach(Class => {
      const subroutes = _private.meta.get(Class, _private.NS.routes);
      const instance = new Class();
      (0, _values2.default)(subroutes).forEach(route => {
        router[route.method](route.view, route.pattern, instance[route.view]);
      });
    });
  });
  server.use(router.routes()).use(router.allowedMethods());
};
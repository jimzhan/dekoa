const route = require('./route')

module.exports = {
  bind: route.bind,
  resource: route.resource,
  /* Standard HTTP Methods */
  get: route.get,
  post: route.post,
  put: route.put,
  del: route.del,
  delete: route.del,
  head: route.head,
  options: route.options,
  trace: route.trace,
  patch: route.patch
}

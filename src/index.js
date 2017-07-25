const route = require('./route');
const schema = require('./schema');

module.exports = {
  bind: route.bind,
  resource: route.resource,
  /* Standard HTTP Methods */
  get: route.get,
  head: route.head,
  post: route.post,
  put: route.put,
  del: route.del,
  delete: route.del,
  connect: route.connect,
  options: route.options,
  trace: route.trace,
  patch: route.patch,
  /* JSON Schema based validators */
  form: schema.form,
  query: schema.query,
  validate: schema.validate,
};

const route = require('./route');
const validators = require('./validators');

module.exports = {
  bind: route.bind,
  resource: route.resource,
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
  form: validators.form,
};

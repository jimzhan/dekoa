const route = require('./route');

module.exports = {
  bind: route.bind,
  resource: route.resource,
  GET: route.GET,
  POST: route.POST,
  PUT: route.PUT,
  DELETE: route.DELETE,
};

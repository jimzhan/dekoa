const debug = require('debug')
const Status = require('http-status-codes')

const log = debug('{dekoa}')
const meta = require('./meta')
const NS = require('./consts').NS

const kwargs = (ctx) => {
  if ((['GET', 'HEAD', 'DELETE'].indexOf(ctx.method.toUpperCase()) >= 0)) {
    return ctx.query
  }
  if (!ctx.request.body) {
    log('Request body is empty, `koa-body` missing?')
    ctx.throw(Status.INTERNAL_SERVER_ERROR)
  }
  return (ctx.is('multipart') && ctx.request.body)
    ? ctx.request.body.fields
    : ctx.request.body || {}
}

module.exports = {
  log,
  meta,
  NS,
  kwargs
}

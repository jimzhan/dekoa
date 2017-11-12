const assert = require('assert')
const Status = require('http-status-codes')
const Tokens = require('csrf')
const debug = require('debug')

const log = debug('{dekoa}')

const xsrfCookieName = 'xsrftoken'
const xsrfHeaderName = 'X-XSRF-Token'
const TOKEN_EXPIRES_IN = 365 * 24 * 3600 * 1000 // Granted token life time on browser cookie (1 year).

const XSRF = (secret, options = {}) => {
  assert(
    secret,
    'XSRF secret is missing'
  )
  const settings = Object.assign({
    xsrfCookieName,
    xsrfHeaderName,
    invalidTokenMessage: 'Invalid XSRF Token',
    invalidTokenStatusCode: Status.FORBIDDEN,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ]
  }, options)
  // --------------------------------------------------
  // *NOTE* Wrapper to `csrf` options.
  // --------------------------------------------------
  const xsrf = Tokens({
    invalidTokenMessage: settings.invalidTokenMessage,
    invalidTokenStatusCode: settings.invalidTokenStatusCode,
    excludedMethods: settings.excludedMethods
  })

  const middleware = async (ctx, next) => {
    ctx.ensureTokenPresent = () => {
      const token = xsrf.create(secret)
      ctx.set(settings.xsrfHeaderName, token)
      ctx.cookies.set(settings.xsrfCookieName, token, {
        httpOnly: true,
        maxAge: TOKEN_EXPIRES_IN
      })
    }

    const token = ctx.cookies.get(settings.xsrfCookieName) || ctx.get(settings.xsrfHeaderName)
    // ----------------------------------------------------------------------------------------------------
    // Ensure client side has XSRF token stored, otherwise generate a new one & send it via response.
    // ----------------------------------------------------------------------------------------------------
    if (!token) {
      ctx.ensureTokenPresent()
      log(`${ctx.path}  => New XSRF Token assigned`)
    }
    // ----------------------------------------------------------------------------------------------------
    if (settings.excludedMethods.indexOf(ctx.method) !== -1) {
      return next()
    }

    if (!token || !xsrf.verify(secret, token)) {
      return ctx.throw(settings.invalidTokenStatusCode, settings.invalidTokenMessage)
    }

    await next()
    // ----------------------------------------------------------------------------------------------------
    // *NOTE* XSRF token should be renewed after each write (PATCH|POST|PUT|DELETE etc.).
    // ----------------------------------------------------------------------------------------------------
    // ctx.ensureTokenPresent()
  }
  return middleware
}

module.exports = XSRF

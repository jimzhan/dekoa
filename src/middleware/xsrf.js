const assert = require('assert')
const Status = require('http-status-codes')
const Tokens = require('csrf')
const debug = require('debug')

const log = debug('{dekoa}')

const xsrfCookieName = 'xsrftoken'
const xsrfHeaderName = 'X-XSRF-Token'

const XSRF = (secret, options = {}) => {
  assert(secret, 'XSRF secret is missing')

  const settings = Object.assign(
    {
      xsrfCookieName,
      xsrfHeaderName,
      invalidTokenMessage: 'Invalid XSRF Token',
      invalidTokenStatusCode: Status.FORBIDDEN,
      excludedMethods: ['GET', 'HEAD', 'OPTIONS', 'TRACE'],
      renewPostWrite: false,
      secure: false
    },
    options
  )
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
      // TODO Remove Cookie Supports.
      ctx.cookies.set(settings.xsrfCookieName, token, {
        httpOnly: false,
        secure: settings.secure
      })
    }

    const token = ctx.get(settings.xsrfHeaderName)
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
      return ctx.throw(
        settings.invalidTokenStatusCode,
        settings.invalidTokenMessage
      )
    }

    await next()
    // ----------------------------------------------------------------------------------------------------
    // *NOTE* XSRF token should be renewed after each write (PATCH|POST|PUT|DELETE etc.).
    // ----------------------------------------------------------------------------------------------------
    if (settings.renewPostWrite) {
      ctx.ensureTokenPresent()
    }
  }
  return middleware
}

module.exports = XSRF

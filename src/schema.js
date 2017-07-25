const Ajv = require('ajv')
const Status = require('http-status-codes')
const { log, meta } = require('./private')

const ajv = new Ajv()

/**
 * Validate incoming HTTP form data using predefine JSON schema.
 * *NOTE* Form data submitted by file load (`multipart`) supported.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const form = (struct) => {
  const decorator = (target, name, descriptor) => {
    const runner = async (ctx, next) => {
      if (!ctx.request.body) {
        log('Request body is empty, `koa-body` missing?')
        ctx.throw(Status.INTERNAL_SERVER_ERROR)
      }
      const params = (ctx.is('multipart') && ctx.request.body) ? ctx.request.body.fields : (ctx.request.body || {})
      const validate = ajv.compile(struct)
      const errors = validate(params) ? null : validate.errors
      if (errors) {
        ctx.throw(Status.UNPROCESSABLE_ENTITY, errors[0])
      }
      await descriptor.value.apply(target, [ctx, next])
    }
    return meta.describe(descriptor, runner)
  }
  return decorator
}

/**
 * Validate incoming HTTP query parameters using predefine JSON schema.
 * *NOTE* Form data submitted by file load (`multipart`) supported.
 * @param {Object} imported JSON schema definition, @SEE http://json-schema.org/.
 */
const query = (struct) => {
  const decorator = (target, name, descriptor) => {
    const runner = async (ctx, next) => {
      const params = ctx.request.query
      const validate = ajv.compile(struct)
      const errors = validate(params) ? null : validate.errors
      if (errors) {
        ctx.throw(Status.UNPROCESSABLE_ENTITY, errors[0])
      }
      await descriptor.value.apply(target, [ctx, next])
    }
    return meta.describe(descriptor, runner)
  }
  return decorator
}

const validate = (struct, type = 'form') => { // eslint-disable-line
  return (type === 'query') ? query(struct) : form(struct)
}

module.exports = { form, query, validate }

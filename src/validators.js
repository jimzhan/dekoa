const Status = require('http-status-codes');
const { log } = require('./private');

/**
 * Common validation helper for incomingprequest values checking.
 * @param {Object} ctx Koa server context.
 * @param {Object} kwargs host wrapper for all incoming request values.
 * @param {String} field field name in incoming request.
 * @param {function|RegExp} validator function or RegExp to check against value.
 */
function validate(ctx, kwargs, field, validator) {
  // fields passed in here are all required.
  if (!Object.prototype.hasOwnProperty.call(kwargs, field)) {
    const message = `${field} is required`;
    log(message);
    ctx.throw(Status.UNPROCESSABLE_ENTITY, message);
  }
  const value = kwargs[field];
  if (typeof validator === 'function' && !validator(value)) {
    const message = `${field}: '${value}' is invalid`;
    log(message);
    ctx.throw(Status.UNPROCESSABLE_ENTITY, message);
  }

  if (validator instanceof RegExp && !validator.test(value)) {
    const message = `${field}: '${value}' is invalid`;
    log(message);
    ctx.throw(Status.UNPROCESSABLE_ENTITY, message);
  }
}

/**
 * Clone a writable Target.descriptor with given value.
 * @param {Object} descriptor existing Target's descriptor to be cloned.
 * @param {Object} value Target's description value to be added.
 */
function describe(descriptor, value) {
  return {
    value,
    writable: descriptor.writable,
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
  };
}

module.exports = {
  /**
   *
   * @param {Object} fields list for validation, supported validators (RegExp & Function). e.g
   *  ```javascript
   *  @form({ username: regex.email })
   *
   *  @form({ metadata: isJSON })
   *  ```
   */
  form(fields = {}) {
    const decorator = (target, name, descriptor) => {
      // [decorator] checkpoint before actual/next view handler.
      const runner = async (ctx, next) => {
        if (!ctx.request.body) {
          log('Request body is empty, `koa-body` missing?');
          ctx.throw(Status.INTERNAL_SERVER_ERROR);
        }
        const form = (ctx.is('multipart') && ctx.request.body) ? ctx.request.body.fields : ctx.request.body;
        Object.entries(fields).forEach(([field, validator]) => {
          validate(ctx, form, field, validator);
        });
        await descriptor.value.apply(target, [ctx, next]);
      };
      return describe(descriptor, runner);
    };
    return decorator;
  },

  query(fields = {}) {
    const decorator = (target, name, descriptor) => {
      // [decorator] checkpoint before actual/next view handler.
      const runner = async (ctx, next) => {
        const query = ctx.request.query;
        Object.entries(fields).forEach(([field, validator]) => {
          validate(ctx, query, field, validator);
        });
        await descriptor.value.apply(target, [ctx, next]);
      };
      return describe(descriptor, runner);
    };
    return decorator;
  },
};

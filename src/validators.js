const debug = require('debug');
const Status = require('http-status-codes');

const log = debug('{validators}');

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

        const form = ctx.request.body;
        Object.entries(fields).forEach(([field, validator]) => {
          // fields passed in here are all required.
          if (!Object.prototype.hasOwnProperty.call(form, field)) {
            log(`${field} is required`);
            ctx.throw(Status.UNPROCESSABLE_ENTITY);
          }
          const value = form[field];
          if (typeof validator === 'function' && !validator(value)) {
            log(`<${field}: ${value}> is invalid`);
            ctx.throw(Status.UNPROCESSABLE_ENTITY);
          }

          if (validator instanceof RegExp && !validator.test(value)) {
            log(`<${field}: ${value}> is invalid`);
            ctx.throw(Status.UNPROCESSABLE_ENTITY);
          }
        });
        await descriptor.value.apply(target, [ctx, next]);
      };
      return {
        value: runner,
        writable: descriptor.writable,
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
      };
    };
    return decorator;
  },
};

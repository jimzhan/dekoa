const fs = require('fs');
const Ajv = require('ajv');
const assert = require('assert');
const Status = require('http-status-codes');
const { log } = require('./private');

const ajv = new Ajv();

/**
 * Validate incoming HTTP request parameters using predefine JSON schema. 
 * @param {String} filepath file path to JSON schema definition.
 * @param {Object} data incoming request data to be validated.
 * 
 * @returns Errors, if any. Null will be returned otherwise.
 */
const validate = (filepath, data = {}) => {
  assert(
    (filepath.endsWith('.json') && fs.statSync(filepath).isFile()),
    `${filepath} is not a valid JSON file.`,
  );
  // eslint-disable-next-line
  const schema = require(filepath);
  const validator = ajv.compile(schema);
  return validator(data) ? null : validator.errors;
};


/**
 * Validate incoming HTTP request parameters using predefine JSON schema. 
 * @param {String} filepath file path to JSON schema definition.
 */
const schema = (filepath) => {
  const decorator = (target, name, descriptor) => {
    const runner = async (ctx, next) => {
      if (!ctx.request.body) {
        log('Request body is empty, `koa-body` missing?');
        ctx.throw(Status.INTERNAL_SERVER_ERROR);
      }
      const form = (ctx.is('multipart') && ctx.request.body) ? ctx.request.body.fields : ctx.request.body;
      const errors = validate(filepath, form);
      if (errors) {
        ctx.status = Status.UNPROCESSABLE_ENTITY;
      } else {
        await descriptor.value.apply(target, [ctx, next]);
      }
    };
    // eslint-disable-next-line
    descriptor.value = runner;
    return descriptor;
  };
  return decorator;
};

module.exports = schema;

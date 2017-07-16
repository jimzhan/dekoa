"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const validate = exports.validate = (options = {}) => {
  const decorator = (target, key, descriptor) => {
    return descriptor;
  };
  return decorator;
};
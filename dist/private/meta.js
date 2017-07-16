'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClass = exports.set = exports.get = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTarget = obj => Object.prototype.hasOwnProperty.call(obj, 'prototype') ? obj.prototype : obj;

const get = exports.get = (target, key) => {
  const prototype = getTarget(target);
  const descriptor = (0, _getOwnPropertyDescriptor2.default)(prototype, key);
  return descriptor && descriptor.value;
};

const set = exports.set = (target, key, value) => {
  const prototype = getTarget(target);
  (0, _defineProperty2.default)(prototype, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  });
};

const isClass = exports.isClass = cls => typeof cls === 'function' && /^\s*class\s+/.test(cls.toString());
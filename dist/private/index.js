'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NS = exports.meta = undefined;

var _consts = require('./consts');

Object.defineProperty(exports, 'NS', {
  enumerable: true,
  get: function () {
    return _consts.NS;
  }
});

var _meta = require('./meta');

var meta = _interopRequireWildcard(_meta);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.meta = meta;

function hasPrototype(target) { 
  return Object.prototype.hasOwnProperty.call(target, 'prototype');
}

function isClass(cls) {
  return typeof cls === 'function' && /^\s*class\s+/.test(cls.toString());
}

function get(target, key) {
  const prototype = hasPrototype(target) ? target.prototype : target;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
  return descriptor && descriptor.value;
}

function set(target, key, value) {
  const prototype = hasPrototype(target) ? target.prototype : target;
  Object.defineProperty(prototype, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true,
  });
}

module.exports = {
  hasPrototype,
  isClass,
  get,
  set,
};

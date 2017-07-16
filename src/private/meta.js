
function getTarget(obj) {
  return Object.prototype.hasOwnProperty.call(obj, 'prototype') ? obj.prototype : obj;
}

module.exports = {
  get(target, key) {
    const prototype = getTarget(target);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    return descriptor && descriptor.value;
  },

  set(target, key, value) {
    const prototype = getTarget(target);
    Object.defineProperty(prototype, key, {
      value,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  },

  isClass(cls) {
    return typeof cls === 'function' && /^\s*class\s+/.test(cls.toString());
  },
};

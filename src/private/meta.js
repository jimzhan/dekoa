
module.exports.get = (target, key) => {
  const descriptor = Object.getOwnPropertyDescriptor(target.prototype || target, key);
  return descriptor && descriptor.value;
};

module.exports.set = (target, key, value) => {
  Object.defineProperty(target.prototype || target, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true,
  });
};

module.exports.isClass = cls => typeof cls === 'function' && /^\s*class\s+/.test(cls.toString());


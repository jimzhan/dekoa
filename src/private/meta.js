
// eslint-disable-next-line
const getTarget = obj => Object.prototype.hasOwnProperty.call(obj, 'prototype') ? obj.prototype : obj;

export const get = (target, key) => {
  const prototype = getTarget(target);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
  return descriptor && descriptor.value;
};

export const set = (target, key, value) => {
  const prototype = getTarget(target);
  Object.defineProperty(prototype, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true,
  });
};

export const isClass = cls => typeof cls === 'function' && /^\s*class\s+/.test(cls.toString());

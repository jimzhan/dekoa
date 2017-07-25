
const get = (target, key) => {
  const descriptor = Object.getOwnPropertyDescriptor(target.prototype || target, key)
  return descriptor && descriptor.value
}

const set = (target, key, value) => {
  Object.defineProperty(target.prototype || target, key, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  })
}

/**
 * Clone a writable Target.descriptor with given value.
 * @param {Object} descriptor existing Target's descriptor to be cloned.
 * @param {Object} value Target's description value to be added.
 */
const describe = (descriptor, value) => { // eslint-disable-line
  return {
    value,
    writable: descriptor.writable,
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable
  }
}

const isClass = cls => typeof cls === 'function' && /^\s*class\s+/.test(cls.toString())

module.exports = { get, set, describe, isClass }

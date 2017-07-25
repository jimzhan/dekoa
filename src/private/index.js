const debug = require('debug')

module.exports = {
  log: debug('{dekoa}'),
  meta: require('./meta'),
  NS: require('./consts').NS
}

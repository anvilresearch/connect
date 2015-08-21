/**
 * Module dependencies
 */

var bucker = require('bucker')

/**
 * Export
 */

module.exports = function (config) {
  var logger = bucker.createLogger(config || {
    console: true
  })

  module.exports = logger

  return logger
}

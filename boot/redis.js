/**
 * Module dependencies
 */

var settings = require('./settings')
var Redis = require('ioredis')

/**
 * Get client
 */

var client

exports.getClient = function () {
  if (client) {
    return client
  } else {
    client = new Redis(settings.redis)
    return client
  }
}

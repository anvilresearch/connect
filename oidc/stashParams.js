/**
 * Module dependencies
 */

var crypto = require('crypto')
var client = require('../boot/redis').getClient()

/**
 * Stash authorization params
 */

function stashParams (req, res, next) {
  var id = crypto.randomBytes(10).toString('hex')
  var key = 'authorization:' + id
  var ttl = 1200 // 20 minutes
  var params = JSON.stringify(req.connectParams)
  var multi = client.multi()

  req.session.state = id
  req.authorizationId = id

  multi.set(key, params)
  multi.expire(key, ttl)
  multi.exec(function (err) {
    return next(err)
  })
}

/**
 * Exports
 */

module.exports = stashParams

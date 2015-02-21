/**
 * Module dependencies
 */

var crypto = require('crypto')
  , client = require('../config/redis')
  ;

/**
 * Stash authorization params
 */

function stashParams (req, res, next) {
  var id      = crypto.randomBytes(10).toString('hex')
    , key     = 'authorization:' + id
    , ttl     = 1200 // 20 minutes
    , params  = JSON.stringify(req.connectParams)
    , multi   = client.multi()
    ;

  req.session.state = id
  req.authorizationId = id;

  multi.set(key, params);
  multi.expire(key, ttl);
  multi.exec(function (err) {
    return next(err);
  });
}


/**
 * Exports
 */

module.exports = stashParams;

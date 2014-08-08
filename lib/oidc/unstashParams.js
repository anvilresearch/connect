/**
 * Module dependencies
 */

var client = require('../../config/redis')
  , MissingStateError = require('../../errors/MissingStateError')
//  , ExpiredAuthorizationError = require('../../errors/ExpiredAuthorizationError')
  ;


/**
 * Unstash authorization params
 */

function unstashParams (req, res, next) {
  var id = req.query.state
    , key = 'authorization:' + id
    ;

  if (!id) {
    return next(new MissingStateError());
  }

  client.get(key, function (err, params) {
    if (err)    { return next(err); }
    if (!params) { return next(new ExpiredAuthorizationRequestError()); }

    try {
      req.connectParams = JSON.parse(params);
    } catch (err) {
      next(err);
    }

    next();
  });
}


/**
 * Exports
 */

module.exports = unstashParams;

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
  // OAuth 2.0 callbacks should have a state param
  // OAuth 1.0 must use the session to store the state value
  var id = req.query.state || req.session.state
    , key = 'authorization:' + id
    ;

  if (!id) { // && request is OAuth 2.0
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

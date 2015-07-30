/**
 * Module dependencies
 */

var settings = require('../boot/settings')
  , url      = require('url')
  , InvalidRequestError = require('../errors/InvalidRequestError')
  ;


/**
 * Enforce referrer middleware
 */

var errorMsg = 'Invalid referrer';

module.exports = function(pathname) {
  // Allow multiple pathnames, or one if you so prefer
  if (typeof pathname === 'string') {
    pathname = [ pathname ];
  }

  var host = url.parse(settings.issuer).host;

  return function enforceReferrer(req, res, next) {
    var referrer = req.get('referrer');

    // Only allow requests with a referrer defined
    if (!referrer) {
      return next(new InvalidRequestError(errorMsg));
    }

    referrer = url.parse(referrer);

    // If the domains don't match, no bueno; issue an error.
    if (referrer.host !== host) {
      return next(new InvalidRequestError(errorMsg));
    }

    var match = false;

    // Check the referrer pathname against every whitelisted
    // path. As long as one matches, `match` will be true and
    // we'll let the request through. If none match, `match`
    // will be false and we'll issue an error.
    for (var i = 0; i < pathname.length; i++) {
      if (pathname[i] === referrer.pathname) {
        match = true;
        break;
      }
    }

    if (!match) {
      return next(new InvalidRequestError(errorMsg));
    }
    
    next();
  }
};

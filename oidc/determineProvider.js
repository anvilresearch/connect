/**
 * Module dependencies
 */

var settings  = require('../boot/settings')
  , providers = require('../providers')
  ;


/**
 * Determine provider middleware
 */

function determineProvider(req, res, next) {
  var providerID = req.params.provider || req.body.provider;
  if (providerID && settings.providers[providerID]) {
    req.provider = providers[providerID];
  }
  next();
}


/**
 * Module export
 */

module.exports = determineProvider;

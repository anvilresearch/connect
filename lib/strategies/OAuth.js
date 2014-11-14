/**
 * Module dependencies
 */

var util     = require('util')
  , request  = require('superagent')
  , Strategy = require('passport-strategy')
  ;

/**
 * OAuthStrategy
 */

function OAuthStrategy (provider, client, verify) {
  Strategy.call(this);
  this.provider   = provider;
  this.endpoints  = provider.endpoints;
  this.client     = client;
  this.verify     = verify;
  this.name       = provider.id;
}

util.inherits(OAuthStrategy, Strategy);


/**
 * Authenticate
 */

function authenticate (req, options) {

}

OAuthStrategy.prototype.authenticate = authenticate;


/**
 * Exports
 */

module.exports = OAuthStrategy;

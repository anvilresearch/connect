/**
 * Module dependencies
 */

var client             = require('../boot/redis')
  , Modinha            = require('modinha')
  , Document           = require('modinha-redis')
  , AuthorizationError = require('../errors/AuthorizationError')
  , nowSeconds         = require('../lib/time-utils').nowSeconds
  ;


/**
 * Model definition
 */

var AuthorizationCode = Modinha.define('authorizationcodes', {

  code: {
    type:     'string',
    required: true,
    default:  Modinha.defaults.random(10),
    unique:   true
    //uniqueId: true
  },

  expires_at: {
    type:     'number',
    default:  expires
  },

  client_id: {
    type:     'string',
    required: true
  },

  redirect_uri: {
    type:     'string',
    required: true,
    format:   'url'
  },

  max_age: {
    type: 'number'
  },

  user_id: {
    type:     'string',
    required: true
  },

  scope: {
    type:     'string',
    required: true
  },

  used: {
    type:     'boolean',
    default:  false
  },

  nonce: {
    type:     'string'
  }

});


/**
 * Expires
 */

function expires () {
  var	secs = nowSeconds(600);

  return secs;
}


/**
 * Document persistence
 */

AuthorizationCode.extend(Document);
AuthorizationCode.__client = client;


/**
 * Exports
 */

module.exports = AuthorizationCode;

/**
 * Module dependencies
 */

var client   = require('../config/redis')
  , Modinha  = require('modinha')
  , Document = require('modinha-redis')
  ;


/**
 * Model definition
 */

var Scope = Modinha.define('scopes', {
  name: {
    type: 'string',
    required: true,
    uniqueId: true
  },
  description: {
    type: 'string',
    required: true
  }
});


/**
 * Document persistence
 */

Scope.extend(Document);
Scope.__client = client;


/**
 * Scope intersections
 */

Scope.intersects('roles');


/**
 * Exports
 */

module.exports = Scope;

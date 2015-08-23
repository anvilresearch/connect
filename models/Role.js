/**
 * Module dependencies
 */

var client = require('../boot/redis').getClient()
var Modinha = require('modinha')
var Document = require('modinha-redis')

/**
 * Model definition
 */

var Role = Modinha.define('roles', {
  name: { type: 'string', required: true, uniqueId: true }
})

/**
 * Document persistence
 */

Role.extend(Document)
Role.__client = client

/**
 * Role intersections
 */

Role.intersects('users')
Role.intersects('clients')
Role.intersects('scopes')

/**
 * Exports
 */

module.exports = Role

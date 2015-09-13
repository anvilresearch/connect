/* global process */

/**
 * Module dependencies
 */

var AnvilConnectKeys = require('anvil-connect-keys')

/**
 * Create a keypair client
 */

var keygen = new AnvilConnectKeys()

/**
 * Attempt to load the key pairs
 */

var keys
try { keys = keygen.loadKeyPairs() } catch (e) {}

/**
 * If the keypairs don't exist, try to create them
 */

if (!keys) {
  try {
    keygen.generateKeyPairs()
    keys = keygen.loadKeyPairs()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

/**
 * Export
 */

module.exports = keys

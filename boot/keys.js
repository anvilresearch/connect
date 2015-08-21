/**
 * Module dependencies
 */

var cwd = process.cwd()
var fs = require('fs')
var path = require('path')
var pem2jwk = require('pem-jwk').pem2jwk

/**
 * Keys
 */

var keys = {}
var privateKey, publicKey
var defaultPublicKeyFile = path.join(cwd, 'config', 'keys', 'public.pem')
var defaultPrivateKeyFile = path.join(cwd, 'config', 'keys', 'private.pem')

/**
 * Look for environment variables.
 */

if (process.env.ANVIL_CONNECT_PRIVATE_KEY) {
  privateKey = new Buffer(process.env.ANVIL_CONNECT_PRIVATE_KEY, 'base64').toString('ascii')
}

if (process.env.ANVIL_CONNECT_PUBLIC_KEY) {
  publicKey = new Buffer(process.env.ANVIL_CONNECT_PUBLIC_KEY, 'base64').toString('ascii')
}

/**
 * Try to read the key files. If they are available locally,
 * they should override the environment variables.
 */

try {
  privateKey = fs.readFileSync(defaultPrivateKeyFile).toString('ascii')
  publicKey = fs.readFileSync(defaultPublicKeyFile).toString('ascii')
} catch (err) {}

/**
 * Ensure the key pair has been loaded
 */

if (!privateKey || !publicKey) {
  console.log('Cannot load keypair')
  process.exit(1)
}

/**
 * Create JWK from public key
 */

var jwk = pem2jwk(publicKey)

/**
 * JWK Set
 */

var jwks = {
  keys: [{
    kty: jwk.kty,
    use: 'sig',
    alg: 'RS256',
    n: jwk.n,
    e: jwk.e
  }]
}

/**
 * Export
 */

keys.privateKey = privateKey
keys.publicKey = publicKey
keys.jwks = jwks
module.exports = keys

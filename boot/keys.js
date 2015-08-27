/**
 * Module dependencies
 */

var cwd = process.cwd()
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var pem2jwk = require('pem-jwk').pem2jwk
var exec = require('child_process').execFileSync

/**
 * Paths and file names
 */

var keyDirectory = path.join(cwd, 'keys')
var defaultPublicKeyFile = path.join(keyDirectory, 'public.pem')
var defaultPrivateKeyFile = path.join(keyDirectory, 'private.pem')

/**
 * Load Keys
 */

function loadKeys () {
  var keys = null

  // Try to read the key files. If they are available locally,
  // they should override the environment variables.
  try {
    keys = {
      privateKey: fs.readFileSync(defaultPrivateKeyFile).toString('ascii'),
      publicKey: fs.readFileSync(defaultPublicKeyFile).toString('ascii')
    }
  } catch (err) {}

  return keys
}

/**
 * Try loading
 */

var keys = loadKeys()

/**
 * Generate keys if not present
 */

if (!keys) {

  try {
    mkdirp.sync(keyDirectory)

    exec('openssl', [
      'genrsa',
      '-out',
      defaultPrivateKeyFile,
      '4096'
    ])

    exec('openssl', [
      'rsa',
      '-pubout',
      '-in',
      defaultPrivateKeyFile,
      '-out',
      defaultPublicKeyFile
    ])

  } catch (e) {
    console.log(
      'Failed to generate keys using OpenSSL. Please ensure you have OpenSSL ' +
      'installed and configured on your system.'
    )
    process.exit(1)
  }

  // Try again
  keys = loadKeys()

  // If they still can't be loaded, kill the process
  if (!keys) {
    console.log(
      'Unable to read the token-signing key pair from ' + keyDirectory
    )
    process.exit(1)
  }
}

/**
 * Create JWK from public key
 */

var jwk = pem2jwk(keys.publicKey)

/**
 * JWK Set
 */

keys.jwks = {
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

module.exports = keys

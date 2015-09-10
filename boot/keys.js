/* global process */

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
var sigPubKeyFile = path.join(keyDirectory, 'sig.rsa.pub.pem')
var sigPrvKeyFile = path.join(keyDirectory, 'sig.rsa.prv.pem')
var encPubKeyFile = path.join(keyDirectory, 'enc.rsa.pub.pem')
var encPrvKeyFile = path.join(keyDirectory, 'enc.rsa.prv.pem')

/**
 * Load Keys
 */

function loadKeys () {
  var keys = null

  // Try to read the key files. If they are available locally,
  // they should override the environment variables.
  try {
    keys = {
      sig: {
        pub: fs.readFileSync(sigPubKeyFile).toString('ascii'),
        prv: fs.readFileSync(sigPrvKeyFile).toString('ascii')
      },
      enc: {
        pub: fs.readFileSync(encPubKeyFile).toString('ascii'),
        prv: fs.readFileSync(encPrvKeyFile).toString('ascii')
      }
    }
  } catch (err) {}

  return keys
}

/**
 * Generate Keys
 */

function generateKeys (dir, pub, prv) {
  try {
    mkdirp.sync(dir)

    exec('openssl', [
      'genrsa',
      '-out',
      prv,
      '4096'
    ])

    exec('openssl', [
      'rsa',
      '-pubout',
      '-in',
      prv,
      '-out',
      pub
    ])
  } catch (e) {
    console.log(
      'Failed to generate keys using OpenSSL. Please ensure you have OpenSSL ' +
      'installed and configured on your system.'
    )
    process.exit(1)
  }
}

/**
 * Try loading
 */

var keys = loadKeys()

/**
 * Generate keys if not present
 */

if (!keys) {
  generateKeys(keyDirectory, sigPubKeyFile, sigPrvKeyFile)
  generateKeys(keyDirectory, encPubKeyFile, encPrvKeyFile)

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
 * Create JWKs from public keys
 */

var sig = pem2jwk(keys.sig.pub)
var enc = pem2jwk(keys.enc.pub)

/**
 * JWK Set
 */

keys.jwks = {
  keys: [
    {
      kty: sig.kty,
      use: 'sig',
      alg: 'RS256',
      n: sig.n,
      e: sig.e
    },
    {
      kty: enc.kty,
      use: 'enc',
      alg: 'RS256',
      n: enc.n,
      e: enc.e
    }
  ]
}

/**
 * Export
 */

module.exports = keys

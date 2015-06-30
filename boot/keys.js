/**
 * Module dependencies
 */

var cwd  = process.cwd();
var fs   = require('fs');
var path = require('path');
var jwks = require(path.join(__dirname, '..', 'lib', 'jwks'));

/**
 * Keys
 */

var keys = {};
var privateKey, publicKey;
var defaultPublicKeyFile  = path.join(cwd, 'config', 'keys', 'public.pem');
var defaultPrivateKeyFile = path.join(cwd, 'config', 'keys', 'private.pem');

/**
 * Look for environment variables.
 */

if (process.env.ANVIL_CONNECT_PRIVATE_KEY) {
  privateKey = new Buffer(process.env.ANVIL_CONNECT_PRIVATE_KEY, 'base64').toString('ascii');
}

if (process.env.ANVIL_CONNECT_PUBLIC_KEY) {
  publicKey  = new Buffer(process.env.ANVIL_CONNECT_PUBLIC_KEY, 'base64').toString('ascii');
}

/**
 * Try to read the key files. If they are available locally,
 * they should override the environment variables.
 */

try {
  privateKey = fs.readFileSync(defaultPrivateKeyFile).toString('ascii');
  publicKey  = fs.readFileSync(defaultPublicKeyFile).toString('ascii');
} catch (err) {}

/**
 * Ensure the key pair has been loaded
 */

if (!privateKey || !publicKey) {
  console.log('Cannot load keypair');
  process.exit(1);
}

/**
 * Export
 */

keys.privateKey = privateKey;
keys.publicKey  = publicKey;
keys.jwks       = jwks(publicKey);
module.exports  = keys;

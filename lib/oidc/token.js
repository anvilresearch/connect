/**
 * Module dependencies
 */

var fs          = require('fs')
  , cwd         = process.cwd()
  , env         = process.env.NODE_ENV || 'development'
  , path        = require('path')
  , config      = require(path.join(cwd, 'config.' + env + '.json'))
  , AccessToken = require('../../models/AccessToken')
  , IDToken     = require('../../models/IDToken')
  ;


/**
 * Key pair
 */

try {
  var privateKey, publicKey;
  privateKey = fs.readFileSync(config.keypair.private).toString('ascii');
  publicKey  = fs.readFileSync(config.keypair.public).toString('ascii');
} catch (err) {
  console.log('Cannot load keypair');
  process.exit(1);
}


/**
 * Exchange code for token
 */

function token (req, res, next) {
  var params = req.body
    , ac     = req.code
    ;

  if (params.grant_type === 'authorization_code') {

    AccessToken.issueFromCode(ac, function (err, response) {
      if (err) {
        return next(err);
      }

      var idToken = new IDToken({
        iss: config.issuer,
        sub: ac.user_id,
        aud: ac.client_id
      });

      response.id_token = idToken.encode(privateKey);

      if (params.state) {
        response.state = params.state;
      }

      res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      });

      res.json(response);
    });

  } else {
    // ????
  }

}


/**
 * Exports
 */

module.exports = token;

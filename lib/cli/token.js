/**
 * Module dependencies
 */

var server = require('../../server')
  , User   = require('../../models/User')
  , Client = require('../../models/Client')
  , AccessToken = require('../../models/AccessToken')
  ;


/**
 * Export
 */

module.exports = function token (argv) {

  // a few ways to do this
  // - call methods on models and reconstruct all this logic
  // - have cli actually hit endpoints mapping cli args to req params
  // - ... lost my train of thought


  var id = argv._[1]
    , scope = ['openid', 'profile'].concat(argv._.slice(2)).join(' ')
    ;

  var request = {
    user: new User({ _id: id }),
    client: new Client({ _id: 'CLI', access_token_type: 'random' }),
    scope: scope
  }

  AccessToken.issue(request, server, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(response.access_token);
    }
    process.exit();
  });

}

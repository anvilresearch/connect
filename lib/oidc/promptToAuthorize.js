/**
 * Module dependencies
 */

var FormUrlencoded = require('form-urlencoded');


/**
 * Prompt to authorize
 */

function promptToAuthorize (req, res, next) {
  var params = req.connectParams
    , client = req.client
    , user   = req.user
    , scopes = req.scopes
    ;


  // The client is not trusted and the user has yet to decide on consent
  if (client.trusted !== 'true' && typeof params.authorize === 'undefined') {

    // render the consent view
    if (req.path === '/authorize') {
      res.render('authorize', {
        request: params,
        client:  client,
        user:    user,
        scopes:  scopes
      });
    }

    // redirect to the authorize endpoint
    else {
      var query = {
        response_type:  params.response_type,
        client_id:      params.client_id,
        redirect_uri:   params.redirect_uri,
        scope:          params.scope,
        nonce:          params.nonce
      };

      if (params.state) {
        query.state = params.state;
      }

      res.redirect('/authorize?' + FormUrlencoded.encode(query));
    }

  }

  // The client is trusted and consent is implied.
  else if (client.trusted === 'true') {
    params.authorize = 'true';
    next();
  }

  // The client is not trusted and consent is decided
  else {
    next();
  }

}


/**
 * Exports
 */

module.exports = promptToAuthorize;

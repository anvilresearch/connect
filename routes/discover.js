/**
 * Well-Known Endpoints
 */

module.exports = function (server) {

  server.get('/.well-known/openid-configuration', function (req, res, next) {
    var issuer = server.settings.issuer;

    res.json({
      issuer:                                           issuer,
      authorization_endpoint:                           issuer + '/authorize',
      token_endpoint:                                   issuer + '/token',
      token_endpoint_auth_methods_supported:            ['client_secret_basic', 'client_secret_post', 'client_secret_jwt'],
      token_endpoint_auth_signing_alg_values_supported: undefined, //[],
      userinfo_endpoint:                                issuer + '/userinfo',
      check_session_iframe:                             undefined,
      end_session_endpoint:                             undefined,
      jwks_uri:                                         undefined,
      registration_endpoint:                            issuer + '/register',
      scopes_supported:                                 ['openid', 'profile'],
      response_types_supported:                         ['code', 'id_token token'],
      acr_values_supported:                             undefined, // [],
      subject_types_supported:                          ['public'],
      userinfo_signing_alg_values_supported:            undefined, // [],
      userinfo_encryption_alg_values_supported:         undefined, // [],
      userinfo_encryption_enc_values_supported:         undefined, // [],
      id_token_signing_alg_values_supported:            undefined, // [],
      id_token_encryption_alg_values_supported:         undefined, // [],
      id_token_encryption_enc_values_supported:         undefined, // [],
      request_object_signing_alg_values_supported:      undefined, // [],
      display_values_supported:                         undefined, // [],
      claim_types_supported:                            undefined, // [],
      claims_supported:                                 undefined, // [],
      claims_parameter_supported:                       undefined, // [],
      service_documentation:                            'http://github.com/christiansmith/anvil-connect/wiki',
      ui_locales_supported:                             undefined // []
    });
  });

  server.get('/.well-known/webfinger', function (req, res, next) {

  });

};

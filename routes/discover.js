/**
 * Well-Known Endpoint
 */

module.exports = function (server) {


  /**
   * OpenID Provider Metadata
   */

  var parameters = [
    'issuer',
    'authorization_endpoint',
    'token_endpoint',
    'userinfo_endpoint',
    'jwks_uri',
    'registration_endpoint',
    'scopes_supported',
    'response_types_supported',
    'response_modes_supported',
    'grant_types_supported',
    'acr_values_supported',
    'subject_types_supported',
    'id_token_signing_alg_values_supported',
    'id_token_encryption_alg_values_supported',
    'id_token_encryption_enc_values_supported',
    'userinfo_signing_alg_values_supported',
    'userinfo_encryption_alg_values_supported',
    'userinfo_encryption_enc_values_supported',
    'request_object_signing_alg_values_supported',
    'request_object_encryption_alg_values_supported',
    'request_object_encryption_enc_values_supported',
    'token_endpoint_auth_methods_supported',
    'token_endpoint_auth_signing_alg_values_supported',
    'display_values_supported',
    'claim_types_supported',
    'claims_supported',
    'service_documentation',
    'claims_locales_supported',
    'ui_locales_supported',
    'claims_parameter_supported',
    'request_parameter_supported',
    'request_uri_parameter_supported',
    'require_request_uri_registration',
    'op_policy_uri',
    'op_tos_uri',
    'check_session_iframe',
    'end_session_endpoint'
  ];


  /**
   * Build Provider Configuration Info from Metadata
   */

  var configuration = parameters.reduce(function (config, param) {
    var value = server.settings[param];
    if (value) { config[param] = value; }
    return config;
  }, {});


  /**
   * OpenID Provider Configuration Information
   */

  server.get('/.well-known/openid-configuration', function (req, res, next) {
    res.json(configuration);
  });

};

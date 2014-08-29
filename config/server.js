/**
 * Configuration dependencies
 */

var cwd          = process.cwd()
  , env          = process.env.NODE_ENV || 'development'
  , fs           = require('fs')
  , path         = require('path')
  , pkg          = require(path.join(__dirname, '..', 'package.json'))
  , config       = require(path.join(cwd, 'config.' + env + '.json'))
  , client       = require('./redis')(config.redis)
  , logger       = require('./logger')(config.logger)
  , express      = require('express')
  , passport     = require('passport')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')
  , RedisStore   = require('connect-redis')(session)
  , sessionStore = new RedisStore({ client: client })
  , cors         = require('cors')
  , jwk          = require('../lib/jwk')
  ;


/**
 * Exports
 */

module.exports = function (server) {

  /**
   * Disable default header
   */

  server.disable('x-powered-by');


  /**
   * Anvil Connect Version
   */

  server.set('version', pkg.version);


  /**
   * Server Port
   */

  server.set('port', process.env.PORT || config.port || 3000);

  /**
   * Views configuration
   */

  server.engine('.jade',      require('jade').__express);
  server.set('views',         path.join(cwd, 'views'));
  server.set('view engine',  'jade');

  /**
   * client_registration
   *    Anvil Connect supports dynamic registration as well as registration
   *    restricted to bearers of valid access tokens. Registration can be
   *    further restricted by requiring a token to have specific scope.
   *    `client_registration` can be set to `dynamic`, `token`, or `scoped`.
   */

  server.set('client_registration', 'scoped');

  /**
   * trusted_registration_scope
   *    Anvil Connect supports "trusted" clients that operate within the same
   *    security realm as the authorization server. Registration of trusted
   *    clients requires privileged access via scope. The default value can be
   *    overridden if required.
   */

  server.set('trusted_registration_scope', 'realm');

  /**
   * providers
   */

  server.set('providers', {});

  /**
   * OpenID Provider Metadata Default Values
   * http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
   *
   * OpenID Providers have metadata describing their configuration. These
   * OpenID Provider Metadata values are used by OpenID Connect:
   */

  /**
   * response_types_supported
   *    REQUIRED. JSON array containing a list of the OAuth 2.0 response_type
   *    values that this OP supports. Dynamic OpenID Providers MUST support the
   *    code, id_token, and the token id_token Response Type values.
   */

  server.set('response_types_supported', [
    'code',
    'id_token token',
    // TODO
    // 'id_token'
    // 'token id_token'
  ]);

  /**
   * response_modes_supported
   *    OPTIONAL. JSON array containing a list of the OAuth 2.0 response_mode
   *    values that this OP supports, as specified in OAuth 2.0 Multiple Response
   *    Type Encoding Practices [OAuth.Responses]. If omitted, the default for
   *    Dynamic OpenID Providers is ["query", "fragment"].
   */

  server.set('response_modes_supported', [
    // TODO
  ]);

  /**
   * grant_types_supported
   *    OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Type values
   *    that this OP supports. Dynamic OpenID Providers MUST support the
   *    authorization_code and implicit Grant Type values and MAY support other
   *    Grant Types. If omitted, the default value is ["authorization_code",
   *    "implicit"].
   */

  server.set('grant_types_supported', [
    'authorization_code',
    'refresh_token'
  ]);

  /**
   * acr_values_supported
   *    OPTIONAL. JSON array containing a list of the Authentication Context Class
   *    References that this OP supports.
   */

  server.set('acr_values_supported', [
    // TODO
  ]);

  /**
   * subject_types_supported
   *    REQUIRED. JSON array containing a list of the Subject Identifier types
   *    that this OP supports. Valid types include pairwise and public.
   */

  server.set('subject_types_supported', [
    // TODO
    //'pairwise',
    'public'
  ]);

  /**
   * id_token_signing_alg_values_supported
   *   REQUIRED. JSON array containing a list of the JWS signing algorithms (alg
   *   values) supported by the OP for the ID Token to encode the Claims in a JWT
   *   [JWT]. The algorithm RS256 MUST be included. The value none MAY be
   *   supported, but MUST NOT be used unless the Response Type used returns no
   *   ID Token from the Authorization Endpoint (such as when using the
   *   Authorization Code Flow).
   */

  server.set('id_token_signing_alg_values_supported', [
    'RS256'
  ]);

  /**
   * id_token_encryption_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms
   *    (alg values) supported by the OP for the ID Token to encode the Claims in
   *    a JWT [JWT].
   */

  server.set('id_token_encryption_alg_values_supported', [
    // TODO
  ]);

  /**
   * id_token_encryption_enc_values_supported
   *   OPTIONAL. JSON array containing a list of the JWE encryption algorithms
   *   (enc values) supported by the OP for the ID Token to encode the Claims in
   *   a JWT [JWT].
   */

  server.set('id_token_encryption_enc_values_supported', [
    // TODO
  ]);

  /**
   * userinfo_signing_alg_values_supported
   *   OPTIONAL. JSON array containing a list of the JWS [JWS] signing algorithms
   *   (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims
   *   in a JWT [JWT]. The value none MAY be included.
   */

  server.set('userinfo_signing_alg_values_supported', [
    // TODO
    'none'
  ]);

  /**
   * userinfo_encryption_alg_values_supported
   *   OPTIONAL. JSON array containing a list of the JWE [JWE] encryption
   *   algorithms (alg values) [JWA] supported by the UserInfo Endpoint to encode
   *   the Claims in a JWT [JWT].
   */

  server.set('userinfo_encryption_alg_values_supported', [
    // TODO
  ]);

  /**
   * userinfo_encryption_enc_values_supported
   *   OPTIONAL. JSON array containing a list of the JWE encryption algorithms
   *   (enc values) [JWA] supported by the UserInfo Endpoint to encode the Claims
   *   in a JWT [JWT].
   */

  server.set('userinfo_encryption_enc_values_supported', [
    // TODO
  ]);

  /**
   * request_object_signing_alg_values_supported
   *   OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg
   *   values) supported by the OP for Request Objects, which are described in
   *   Section 6.1 of OpenID Connect Core 1.0 [OpenID.Core]. These algorithms are
   *   used both when the Request Object is passed by value (using the request
   *   parameter) and when it is passed by reference (using the request_uri
   *   parameter). Servers SHOULD support none and RS256.
   */

  server.set('request_object_signing_alg_values_supported', [
    // TODO
  ]);

  /**
   * request_object_encryption_alg_values_supported
   *   OPTIONAL. JSON array containing a list of the JWE encryption algorithms
   *   (alg values) supported by the OP for Request Objects. These algorithms are
   *   used both when the Request Object is passed by value and when it is passed
   *   by reference.
   */

  server.set('request_object_encryption_alg_values_supported', [
    // TODO
  ]);

  /**
   * request_object_encryption_enc_values_supported
   *   OPTIONAL. JSON array containing a list of the JWE encryption algorithms
   *   (enc values) supported by the OP for Request Objects. These algorithms are
   *   used both when the Request Object is passed by value and when it is passed
   *   by reference.
   */

  server.set('request_object_encryption_enc_values_supported', [
    // TODO
  ]);

  /**
   * token_endpoint_auth_methods_supported
   *   OPTIONAL. JSON array containing a list of Client Authentication methods
   *   supported by this Token Endpoint. The options are client_secret_post,
   *   client_secret_basic, client_secret_jwt, and private_key_jwt, as described
   *   in Section 9 of OpenID Connect Core 1.0 [OpenID.Core]. Other
   *   authentication methods MAY be defined by extensions. If omitted, the
   *   default is client_secret_basic -- the HTTP Basic Authentication Scheme
   *   specified in Section 2.3.1 of OAuth 2.0 [RFC6749].
   */

  server.set('token_endpoint_auth_methods_supported', [
    'client_secret_basic',
    'client_secret_post',
    //'client_secret_jwt',
    //'private_key_jwt',
    //'none'
  ]);

  /**
   * token_endpoint_auth_signing_alg_values_supported
   *   OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg
   *   values) supported by the Token Endpoint for the signature on the JWT [JWT]
   *   used to authenticate the Client at the Token Endpoint for the
   *   private_key_jwt and client_secret_jwt authentication methods. Servers
   *   SHOULD support RS256. The value none MUST NOT be used.
   */

  server.set('token_endpoint_auth_signing_alg_values_supported', [
    //'RS256'
  ]);

  /**
   * display_values_supported
   *   OPTIONAL. JSON array containing a list of the display parameter values
   *   that the OpenID Provider supports. These values are described in Section
   *   3.1.2.1 of OpenID Connect Core 1.0 [OpenID.Core].
   */

  server.set('display_values_supported', [
    // TODO
  ]);

  /**
   * claim_types_supported
   *   OPTIONAL. JSON array containing a list of the Claim Types that the OpenID
   *   Provider supports. These Claim Types are described in Section 5.6 of
   *   OpenID Connect Core 1.0 [OpenID.Core]. Values defined by this
   *   specification are normal, aggregated, and distributed. If omitted, the
   *   implementation supports only normal Claims.
   */

  server.set('claim_types_supported', [
    'normal'
  ]);

  /**
   * claims_supported
   *   RECOMMENDED. JSON array containing a list of the Claim Names of the Claims
   *   that the OpenID Provider MAY be able to supply values for. Note that for
   *   privacy or other reasons, this might not be an exhaustive list.
   */

  server.set('claims_supported', [
    'iss',
    'sub',
    'aud',
    'acr',
    'name',
    'given_name',
    'family_name',
    'middle_name',
    'nickname',
    'preferred_username',
    'profile',
    'picture',
    'website',
    'email',
    'email_verified',
    'zoneinfo',
    'locale',
    'joined_at',
    'updated_at'
  ]);

  /**
   * service_documentation
   *   OPTIONAL. URL of a page containing human-readable information that
   *   developers might want or need to know when using the OpenID Provider. In
   *   particular, if the OpenID Provider does not support Dynamic Client
   *   Registration, then information on how to register Clients needs to be
   *   provided in this documentation.
   */

  server.set('service_documentation',
             'https://github.com/christiansmith/anvil-connect/wiki');

  /**
   * claims_locales_supported
   *   OPTIONAL. Languages and scripts supported for values in Claims being
   *   returned, represented as a JSON array of BCP47 [RFC5646] language tag
   *   values. Not all languages and scripts are necessarily supported for all
   *   Claim values.
   */

  server.set('claims_locales_supported', [
    // TODO
  ]);

  /**
   * ui_locales_supported
   *   OPTIONAL. Languages and scripts supported for the user interface,
   *   represented as a JSON array of BCP47 [RFC5646] language tag values.
   */

  server.set('ui_locales_supported', [
    // TODO
  ]);

  /**
   * claims_parameter_supported
   *   OPTIONAL. Boolean value specifying whether the OP supports use of the
   *   claims parameter, with true indicating support. If omitted, the default
   *   value is false.
   */

  server.set('claims_parameter_supported', false);

  /**
   * request_parameter_supported
   *   OPTIONAL. Boolean value specifying whether the OP supports use of the
   *   request parameter, with true indicating support. If omitted, the default
   *   value is false.
   */

  server.set('request_parameter_supported', false);

  /**
   * request_uri_parameter_supported
   *   OPTIONAL. Boolean value specifying whether the OP supports use of the
   *   request_uri parameter, with true indicating support. If omitted, the
   *   default value is true.
   */

  server.set('request_uri_parameter_supported', false);

  /**
   * request_request_uri_registration
   *   OPTIONAL. Boolean value specifying whether the OP requires any request_uri
   *   values used to be pre-registered using the request_uris registration
   *   parameter. Pre-registration is REQUIRED when the value is true. If
   *   omitted, the default value is false.
   */

  server.set('require_request_uri_registration', false);

  /**
   * op_policy_uri
   *   OPTIONAL. URL that the OpenID Provider provides to the person registering
   *   the Client to read about the OP's requirements on how the Relying Party
   *   can use the data provided by the OP. The registration process SHOULD
   *   display this URL to the person registering the Client if it is given.
   */

  server.set('op_policy_uri', undefined);

  /**
   * op_tos_uri
   *   OPTIONAL. URL that the OpenID Provider provides to the person registering
   *   the Client to read about OpenID Provider's terms of service. The
   *   registration process SHOULD display this URL to the person registering the
   *   Client if it is given.
   */

  server.set('op_tos_uri', undefined);


  /**
   * Load config file settings and override defaults
   */

  Object.keys(config).forEach(function (key) {
    server.set(key, config[key]);
  });


  /**
   * Required Configuration Values
   */

  /**
   * issuer
   *   REQUIRED. URL using the https scheme with no query or fragment component
   *   that the OP asserts as its Issuer Identifier. If Issuer discovery is
   *   supported (see Section 2), this value MUST be identical to the issuer
   *   value returned by WebFinger. This also MUST be identical to the iss Claim
   *   value in ID Tokens issued from this Issuer.
   */

  if (!server.settings.issuer) {
    throw new Error('Issuer must be configured');
  }

  /**
   * Config-file dependenct settings
   */

  var issuer = server.settings.issuer;

  /**
   * authorization_endpoint
   *   REQUIRED. URL of the OP's OAuth 2.0 Authorization Endpoint [OpenID.Core].
   */

  server.set('authorization_endpoint', issuer + '/authorize');

  /**
   * token_endpoint
   *   URL of the OP's OAuth 2.0 Token Endpoint [OpenID.Core]. This is REQUIRED
   *   unless only the Implicit Flow is used.
   */

  server.set('token_endpoint', issuer + '/token');

  /**
   * userinfo_endpoint
   *   RECOMMENDED. URL of the OP's UserInfo Endpoint [OpenID.Core]. This URL
   *   MUST use the https scheme and MAY contain port, path, and query parameter
   *   components.
   */

  server.set('userinfo_endpoint', issuer + '/userinfo');

  /**
   * jwks_uri
   *   REQUIRED. URL of the OP's JSON Web Key Set [JWK] document. This contains
   *   the signing key(s) the RP uses to validate signatures from the OP. The JWK
   *   Set MAY also contain the Server's encryption key(s), which are used by RPs
   *   to encrypt requests to the Server. When both signing and encryption keys
   *   are made available, a use (Key Use) parameter value is REQUIRED for all
   *   keys in the referenced JWK Set to indicate each key's intended usage.
   *   Although some algorithms allow the same key to be used for both signatures
   *   and encryption, doing so is NOT RECOMMENDED, as it is less secure. The JWK
   *   x5c parameter MAY be used to provide X.509 representations of keys
   *   provided. When used, the bare key values MUST still be present and MUST
   *   match those in the certificate.
   */

  server.set('jwks_uri', undefined);

  /**
   * registration_endpoint
   *   RECOMMENDED. URL of the OP's Dynamic Client Registration Endpoint
   *   [OpenID.Registration].
   */

  server.set('registration_endpoint', issuer + '/register');

  /**
   * scopes_supported
   *   RECOMMENDED. JSON array containing a list of the OAuth 2.0 [RFC6749] scope
   *   values that this server supports. The server MUST support the openid scope
   *   value. Servers MAY choose not to advertise some supported scope values
   *   even when this parameter is used, although those defined in [OpenID.Core]
   *   SHOULD be listed, if supported.
   *
   *   TODO: Should these be pulled from redis?
   */

  server.set('scopes_supported', ['openid', 'profile']);

  /**
   * OpenID Provider Discovery Metadata (Session)
   * http://openid.net/specs/openid-connect-session-1_0.html#OPMetadata
   *
   */

  /**
   * check_session_iframe
   *   REQUIRED. URL of an OP iframe that supports cross-origin communications
   *   for session state information with the RP Client, using the HTML5
   *   postMessage API. The page is loaded from an invisible iframe embedded in
   *   an RP page so that it can run in the OP's security context. It accepts
   *   postMessage requests from the relevant RP iframe and uses postMessage to
   *   post back the login status of the End-User at the OP.
   */

  server.set('check_session_iframe', undefined);

  /**
   * end_session_endpoint
   *   REQUIRED. URL at the OP to which an RP can perform a redirect to request
   *   that the End-User be logged out at the OP.
   */

  server.set('end_session_endpoint', undefined);


  /**
   * Load Key Pair
   */

  var privateKey, publicKey
    , defaultPublicKeyFile  = path.join(cwd, 'keys', 'public.pem')
    , defaultPrivateKeyFile = path.join(cwd, 'keys', 'private.pem')
    ;

  // first, look for environment variables.
  // in production, the files should not be present
  if (process.env.ANVIL_CONNECT_PRIVATE_KEY) {
    privateKey = new Buffer(process.env.ANVIL_CONNECT_PRIVATE_KEY, 'base64').toString('ascii');
  }

  if (process.env.ANVIL_CONNECT_PUBLIC_KEY) {
    publicKey  = new Buffer(process.env.ANVIL_CONNECT_PUBLIC_KEY, 'base64').toString('ascii');
  }

  // next, try to read the key files
  // if they are available locally, they should override
  // any found environment variables
  try {
    privateKey = fs.readFileSync(defaultPrivateKeyFile).toString('ascii');
    publicKey  = fs.readFileSync(defaultPublicKeyFile).toString('ascii');
  } catch (err) {}

  // ensure the key pair has been loaded
  if (!privateKey || !publicKey) {
    console.log('Cannot load keypair');
    process.exit(1);
  }

  // assign the values discovered
  else {
    server.set('privateKey', privateKey);
    server.set('publicKey',  publicKey);
  }


  // JWKs
  server.set('jwks', [jwk(publicKey)]);


  /**
   * Request Parsing
   */

  server.use(cookieParser(server.settings.cookie_secret));
  server.use(bodyParser());


  /**
   * Express Session
   */

  server.use(session({
    store: sessionStore,
    secret: server.settings.session_secret
  }));


  /**
   * Passport Authentication Middleware
   */

  server.use(passport.initialize());
  server.use(passport.session());


  /**
   * Cross-Origin Support
   */

  server.use(cors());


  /**
   * Logging
   */

  server.use(logger.middleware());


  /**
   * Serve Static Files
   */

  server.use(express.static(path.join(cwd, 'public')));


  /**
   * OpenID Provider Metadata Properties
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

  server.OpenIDConfiguration = parameters.reduce(function (config, param) {
    var value = server.settings[param];
    if (value) { config[param] = value; }
    return config;
  }, {});

};

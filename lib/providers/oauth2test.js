/**
 * OAuth 2.0 Test provider
 */

module.exports = function (config) {
  return {
    id:             'oauth2test',
    name:           'OAuth2Test',
    protocol:       'OAuth2',
    url:            'https://anvil.io',
    redirect_uri:    config.issuer + 'connect/oauth2test/callback',
    endpoints: {
      authorize: {
        url:        'https://anvil.io/authorize',
        method:     'POST'
      },
      token: {
        url:        'https://anvil.io/token',
        method:     'POST',
        auth:       'client_secret_basic'
      },
      user: {
        url:        'https://anvil.io/user',
        method:     'GET',
        auth:       'bearer_token'
      }
    },
    mapping: {
      id:           'uid',
      name:         'fullname'
    }
  };
};

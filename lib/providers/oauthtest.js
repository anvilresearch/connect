/**
 * OAuth 1.0 Test provider
 */

module.exports = function (config) {
  return {
    id:                     'oauthtest',
    name:                   'OAuthTest',
    protocol:               'OAuth 1.0',
    url:                    'https://anvil.io',
    oauth_callback:         'https://anvil.io/connect/oauthtest/callback',
    oauth_signature_method: 'PLAINTEXT',
    endpoints: {
      credentials: {
        url:                'https://anvil.io/credentials',
        method:             'POST',
        header:             'Authorization',
        scheme:             'OAuth'
      },
      authorization: {
        url:                'https://anvil.io/authorization'
      },
      token: {
        url:                'https://anvil.io/token',
        method:             'POST'
      }
    },
    mapping: {

    },
  };
};

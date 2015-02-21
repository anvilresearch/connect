/**
 * Buffer
 */

module.exports = function (config) {
  return {
    id:             'buffer',
    name:           'buffer',
    protocol:       'OAuth2',
    url:            '',
    redirect_uri:    config.issuer + '/connect/buffer/callback',
    endpoints: {
      authorize: {
        url:        'https://bufferapp.com/oauth2/authorize',
        method:     'POST',
      },
      token: {
        url:        'https://api.bufferapp.com/1/oauth2/token.json',
        method:     'POST',
        auth:       'client_secret_basic'
      },
      user: {
        url:        'https://api.bufferapp.com/1/user.json',
        method:     'GET',
        auth: {
          query:    'access_token'
        }
      }
    },
    mapping: {
      id:           'id',
      name:         'name',
    }
  };
};

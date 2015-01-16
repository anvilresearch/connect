/**
 * Reddit
 */

module.exports = function (config) {
  return {
    id:                   'reddit',
    name:                 'reddit',
    protocol:             'OAuth 2.0',
    url:                  '',
    redirect_uri:          config.issuer + '/connect/reddit/callback',
    endpoints: {
      authorize: {
        url:              'https://ssl.reddit.com/api/v1/authorize',
        method:           'POST',
      },
      token: {
        url:              'https://ssl.reddit.com/api/v1/access_token',
        method:           'POST',
        auth:             'client_secret_basic'
      },
      user: {
        url:              'https://oauth.reddit.com/api/v1/me',
        method:           'GET',
        auth: {
          header:         'Authorization',
          scheme:         'Bearer'
        }
      }
    },
    scope:               ['identity'],
    mapping: {
      id:                 'id',
      emailVerified:      'has_verified_email',
      preferredUsername:  'name'
    }
  };
};

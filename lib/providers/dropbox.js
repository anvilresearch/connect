/**
 * Dropbox
 */

module.exports = function (config) {
  return {
    id:               'dropbox',
    name:             'Dropbox',
    protocol:         'OAuth 2.0',
    url:              'https://www.dropbox.com',
    redirect_uri:      config.issuer + '/connect/dropbox/callback',
    endpoints: {
      authorize: {
        url:          'https://www.dropbox.com/1/oauth2/authorize',
        method:       'POST',
      },
      token: {
        url:          'https://api.dropbox.com/1/oauth2/token',
        method:       'POST',
        auth:         'client_secret_basic'
      },
      user: {
        url:          'https://api.dropbox.com/1/account/info',
        method:       'GET',
        auth: {
          header:     'Authorization',
          scheme:     'Bearer'
        }
      }
    },
    mapping: {
      id:             'uid',
      name:           'display_name',
      email:          'email',
      emailVerified:  'email_verified',
      locale:         'country'
    }
  };
};

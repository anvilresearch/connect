/**
 * WordPress
 */

module.exports = function (config) {
  return {
    id:                   'wordpress',
    name:                 'WordPress',
    protocol:             'OAuth 2.0',
    url:                  '',
    redirect_uri:          config.issuer + '/connect/wordpress/callback',
    endpoints: {
      authorize: {
        url:              'https://public-api.wordpress.com/oauth2/authorize',
        method:           'POST',
      },
      token: {
        url:              'https://public-api.wordpress.com/oauth2/token',
        method:           'POST',
        auth:             'client_secret_post'
      },
      user: {
        url:              'https://public-api.wordpress.com/rest/v1/me',
        method:           'GET',
        auth: {
          header:         'Authorization',
          scheme:         'Bearer'
        }
      }
    },
    mapping: {
      id:                 'ID',
      email:              'email',
      emailVerified:      'email_verified',
      name:               'display_name',
      preferredUsername:  'username',
      picture:            'avatar_URL',
      profile:            'profile_URL',
    }
  };
};

/**
 * GitHub
 */

module.exports = function (config) {
  return {
    id:                   'github',
    name:                 'GitHub',
    protocol:             'OAuth 2.0',
    url:                  'https://github.com',
    redirect_uri:          config.issuer + '/connect/github/callback',
    endpoints: {
      authorize: {
        url:              'https://github.com/login/oauth/authorize',
        method:           'POST',
      },
      token: {
        url:              'https://github.com/login/oauth/access_token',
        method:           'POST',
        auth:             'client_secret_post'
      },
      user: {
        url:              'https://api.github.com/user',
        method:           'GET',
        auth: {
          header:         'Authorization',
          scheme:         'Bearer'
        }
      }
    },
    separator:            ',',
    mapping: {
      id:                 'id',
      email:              'email',
      name:               'name',
      website:            'blog',
      preferredUsername:  'login',
      profile:            'html_url',
      picture:            'avatar_url',
    }
  };
};

/**
 * Instagram
 */

module.exports = function (config) {
  return {
    id:                   'instagram',
    name:                 'instagram',
    protocol:             'OAuth2',
    url:                  '',
    redirect_uri:          config.issuer + '/connect/instagram/callback',
    endpoints: {
      authorize: {
        url:              'https://api.instagram.com/oauth/authorize/',
        method:           'POST',
      },
      token: {
        url:              'https://api.instagram.com/oauth/access_token',
        method:           'POST',
        auth:             'client_secret_post'
      },
      user: {
        url:              'https://api.instagram.com/v1/users/self',
        method:           'GET',
        auth: {
          query:          'access_token'
        }
      }
    },
    mapping: {
      id:                 'data.id',
      name:               'data.fullname',
      preferredUsername:  'data.username',
      picture:            'data.profile_picture',
      website:            'data.website',
    }
  };
};

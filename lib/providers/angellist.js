/**
 * Angel.co
 */

module.exports = function (config) {
  return {
    id:               'angellist',
    name:             'angellist',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:      config.issuer + '/connect/angellist/callback',
    endpoints: {
      authorize: {
        url:          'https://angel.co/api/oauth/authorize',
        method:       'POST',
      },
      token: {
        url:          'https://angel.co/api/oauth/token',
        method:       'POST',
        auth:         'client_secret_basic'
      },
      user: {
        url:          'https://api.angel.co/1/me',
        method:       'GET',
        auth: {
          query:      'access_token'
        }
      }
    },
    mapping: {
      id:             'id',
      name:           'name',
      picture:        'image',
      profile:        'angellist_url',
      email:          'email',
      website:        'online_bio_url',
    }
  };
};

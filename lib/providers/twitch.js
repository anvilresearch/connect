/**
 * Twitch
 */

module.exports = function (config) {
  return {
    id:             'twitch',
    name:           'Twitch',
    protocol:       'OAuth2',
    url:            '',
    redirect_uri:    config.issuer + '/connect/twitch/callback',
    endpoints: {
      authorize: {
        url:        'https://api.twitch.tv/kraken/oauth2/authorize',
        method:     'POST',
      },
      token: {
        url:        'https://api.twitch.tv/kraken/oauth2/token',
        method:     'POST',
        auth:       'client_secret_post'
      },
      user: {
        url:        'https://api.twitch.tv/kraken/user',
        method:     'GET',
        auth: {
          header:   'Authorization',
          scheme:   'OAuth'
        }
      }
    },
    mapping: {
      id:           '_id',
      name:         'name',
      profile:      '_links.self'
    }
  };
};

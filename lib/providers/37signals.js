/**
 * 37signals
 */

module.exports = function (config) {
  return {
    id:               '37signals',
    name:             '37signals',
    protocol:         'OAuth2',
    url:              '',
    redirect_uri:      config.issuer + '/connect/37signals/callback',
    endpoints: {
      authorize: {
        url:          'https://launchpad.37signals.com/authorization/new',
        method:       'POST'
      },
      token: {
        url:          'https://launchpad.37signals.com/authorization/token',
        method:       'POST',
        auth:         'client_secret_basic'
      },
      user: {
        url:          'https://launchpad.37signals.com/authorization.json',
        method:       'GET',
        auth: {
          header:     'Authorization',
          scheme:     'Bearer'
        }
      }
    },
    mapping: {

    }
  };
};

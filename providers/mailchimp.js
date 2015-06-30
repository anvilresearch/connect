/**
 * MailChimp
 */

module.exports = function (config) {
  return {
    id:             'mailchimp',
    name:             'mailchimp',
    protocol:         'OAuth2',
    url:              '',
    redirect_uri:     localhost(config.issuer) + '/connect/mailchimp/callback',
    endpoints: {
      authorize: {
        url:    'https://login.mailchimp.com/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://login.mailchimp.com/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://login.mailchimp.com/oauth2/metadata',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    mapping: {

    }
  };
};

function localhost(issuer) {
  return issuer.replace('localhost', '127.0.0.1');
}

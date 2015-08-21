/**
 * LinkedIn
 */

module.exports = function (config) {
  return {
    id: 'linkedin',
    name: 'linkedin',
    protocol: 'OAuth2',
    url: '',
    redirect_uri: config.issuer + '/connect/linkedin/callback',
    endpoints: {
      authorize: {
        url: 'https://www.linkedin.com/uas/oauth2/authorization',
        method: 'POST'
      },
      token: {
        url: 'https://www.linkedin.com/uas/oauth2/accessToken',
        method: 'POST',
        auth: 'client_secret_post'
      },
      user: {
        url: 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-url,public-profile-url,email-address)',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        },
        params: {
          format: 'json'
        }
      }
    },
    mapping: {
      id: 'id',
      givenName: 'firstName',
      familyName: 'lastName',
      email: 'emailAddress',
      picture: 'pictureUrl',
      profile: 'publicProfileUrl'
    }
  }
}

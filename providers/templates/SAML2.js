/**
 * Basic SAML 2.0 provider template
 */

module.exports = function (config, templateConfig) {
  return {
    id: 'SAML2',
    protocol: 'SAML2',
    callbackUrl: config.issuer + '/connect/SAML2/callback',
    mapping: {
      id: 'uid',
      email: 'email',
      name: 'cn',
      givenName: 'givenName',
      familyName: 'sn',
      phoneNumber: 'telephoneNumber',
      address: function (info) {
        return {
          formatted: info.postalAddress,
          street_address: info.street,
          locality: info.l,
          region: info.st,
          postal_code: info.postalCode,
          country: info.co
        }
      }
    }
  }
}

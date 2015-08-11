/**
 * LDAP provider template
 */

module.exports = function(config, templateConfig) {
  return {
    id: 'LDAP',
    protocol: 'LDAP',
    fields: [
      { name: 'username', placeholder: 'username' },
      { name: 'password', type: 'password' }
    ],
    mapping: {
      id:          'dn',
      email:       'mail',
      name:        'cn',
      givenName:   'givenName',
      familyName:  'sn',
      phoneNumber: 'telephoneNumber',
      address: function (info) {
        return {
          formatted:      info.postalAddress,
          street_address: info.street,
          locality:       info.l,
          region:         info.st,
          postal_code:    info.postalCode,
          country:        info.co
        };
      }
    }
  };
};

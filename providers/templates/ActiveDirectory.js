/**
 * Active Directory provider template
 */

module.exports = function(config, templateConfig) {
  return {
    id: 'ActiveDirectory',
    protocol: 'ActiveDirectory',
    fields: [
      { name: 'username', placeholder: 'User@domain' },
      { name: 'password', type: 'password' }
    ],
    mapping: {
      id:          'objectGUID',
      email:       'userPrincipalName',
      name:        'name',
      givenName:   'givenName',
      familyName:  'sn',
      phoneNumber: function (info) {
        return info.telephoneNumber ||
               info.mobile ||
               info.homePhone ||
               info.otherHomePhone ||
               info.otherTelephone ||
               info.ipPhone ||
               info.otherIpPhone;
      }
    }
  };
};

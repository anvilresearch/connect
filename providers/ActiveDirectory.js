/**
 * Basic Active Directory provider
 */

module.exports = function(config) {
  return {
    id: 'ActiveDirectory',
    name: 'Active Directory',
    templates: [ 'ActiveDirectory' ]
  };
};
/**
 * Password
 */

module.exports = function (config) {
  return {
    id:                 'password',
    name:               'local',
    protocol:           'Password',
    usernameField:      'email',
    passReqToCallback:  'true'
  };
};

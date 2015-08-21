/**
 * Password
 */

module.exports = function (config) {
  return {
    id: 'password',
    name: 'Email and Password',
    protocol: 'Password',
    amr: 'pwd',
    daysToCrack: 14,
    fields: [
      { name: 'email', type: 'email' },
      { name: 'password', type: 'password' }
    ],
    usernameField: 'email',
    passReqToCallback: 'true'
  }
}

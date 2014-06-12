/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , inquirer = require('inquirer')
  , ini = require('iniparser')
  , server = require('../../server')
  , User = require(path.join(__dirname, '..', '..', 'models', 'User'))
  ;


/**
 * Export
 */

module.exports = function (argv) {
  var name, email;

  try {
    var gitconfig = ini.parseSync(path.join(process.env.HOME, '.gitconfig'));
    name = gitconfig.user && gitconfig.user.name;
    email = gitconfig.user && gitconfig.user.email;
  } catch (e) {
    console.log(e)
  }

  console.log();
  inquirer.prompt([
    {
      name:     'name',
      message:  'Enter your full name',
      type:     'input',
      default:   name
    },
    {
      name:     'email',
      message:  'Enter your email',
      type:     'input',
      default:   email
    },
    {
      type:     'password',
      message:  'Create a new password',
      name:     'password'
    }
  ], function (answers) {
    User.insert(answers, function (err, user) {
      if (err) {
        console.log();
        console.log(err.message);
        console.log();
      } else {
        console.log();
        console.log(user);
        console.log();
      }
      process.exit();
    });
  });
};

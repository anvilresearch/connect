/* global process:true */

/**
 * Module dependencies
 */

var nodemailer   = require('nodemailer')
  , settings     = require('./settings')
  , cons         = require('consolidate')
  , htmlToText   = require('html-to-text')
  , path         = require('path')
  , templatesDir = path.resolve(process.cwd(), 'email')
  , engine
  , engineName
  , defaultFrom
  ;


/**
 * Render e-mail templates to HTML and text
 */

function render(template, locals, callback) {
  var engineExt =
    engineName.charAt(0) === '.' ? engineName : ('.' + engineName);
  var tmplPath = path.join(templatesDir, template + engineExt);
  
  engine(tmplPath, locals, function (err, html) {
    if (err) { return callback(err); }
    
    var text = htmlToText.fromString(html, {
      wordwrap: 72 // A little less than 80 characters per line is the de-facto
                   // standard for e-mails to allow for some room for quoting
                   // and e-mail client UI elements (e.g. scrollbar)
    });
    
    callback(null, html, text);
  });
}


/**
 * Helper function to send e-mails using templates
 */

function sendMail(template, locals, options, callback) {
  var self = this;
  this.render(template, locals, function(err, html, text) {
    if (err) { return callback(err); }
    
    self.transport.sendMail({
      from: options.from || defaultFrom,
      to: options.to,
      subject: options.subject,
      html: html,
      text: text
    }, callback);
  });
}


/**
 * Export
 */

module.exports = function (config) {
  var fromVerifier = /^(?:\w|\s)+<[a-z]+@[a-z]+\.[a-z]{2,}>$/igm;
  var transport = config && nodemailer.createTransport(config);
  
  engineName = (config && config.view_engine) ||
               settings.view_engine ||
               'hogan';
  engine = cons[engineName];
  
  if (transport && (typeof config.from !== 'string' ||
    !fromVerifier.test(config.from))) {
      console.error(config.from);
    throw new Error('From field not provided for mailer. ' +
                    'Expected "Display Name <email@example.com>"');
  }
  
  defaultFrom = config && config.from;
  
  module.exports = {
    render: render,
    transport: transport,
    sendMail: sendMail
  };
};


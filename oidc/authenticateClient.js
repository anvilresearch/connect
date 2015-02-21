/**
 * Module dependencies
 */

var Client = require('../models/Client');


/**
 * Authenticate Client
 */

function authenticateClient (req, res, next) {
  Client.authenticate(req, function (err, client) {
    if (err) { return next(err); }
    req.client = client;
    next();
  });
}


/**
 * Export
 */

module.exports = authenticateClient;

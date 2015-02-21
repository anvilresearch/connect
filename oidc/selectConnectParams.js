/**
 * Module dependencies
 */



/**
 * Lookup the key for request params
 */

var lookupField = {
  'GET': 'query',
  'POST': 'body'
};


/**
 * Select Authorization Parameters
 */

function selectConnectParams (req, res, next) {
  req.connectParams = req[lookupField[req.method]] || {};
  next();
}


/**
 * Exports
 */

module.exports = selectConnectParams;


/**
 * Module dependencies
 */

var client = require('../boot/redis');


/**
 * Session endpoint
 */

module.exports = function session (req, res, next) {
  // Set cookie to be used as browser state. This
  // cookie MUST NOT be httpOnly because we need
  // to access it with JS.
  res.cookie('anvil.connect.op.state', req.session.opbs);

  // Don't cache the response
  res.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  });

  res.render('session');
};

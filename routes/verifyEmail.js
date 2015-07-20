/**
 * Module dependencies
 */

var settings = require('../boot/settings')
  , User     = require('../models/User')
  ;


/**
 * E-mail Verification Endpoint
 */

module.exports = function (server) {
  server.get('/email/verify', function(req, res, next) {
    
    User.getByEmailVerifyToken(req.query.token, function(err, user) {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        
        res.render('verifyEmail', {
          error: 'Invalid or expired verification code.'
        });
        
      } else {
        
        User.patch(user._id, {
          
          dateEmailVerified: Date.now(),
          emailVerified: true
          
        }, {

          $unset: [ 'emailVerifyToken' ]

        }, function (err, patchedUser) {
          
          if (err) { return next(err); }
          if (!patchedUser) { return next(new Error('Unable to patch user')); }
          
          res.render('verifyEmail', {});
          
        });
        
      }
    });
  });
};


/**
 * Session endpoint
 */

module.exports = function (server) {

  /**
   * Check session iframe
   */



  /*
   *  4.2.  OP iframe
   *  http://openid.net/specs/openid-connect-session-1_0.html#OPiframe
   *
   *  The RP also loads an invisible OP iframe into itself from the OP's check_session_iframe.
   *
   *  The RP MUST assign an id attribute to the iframe so that it can address it, as described above.
   *
   *  The OP iframe MUST enforce that the caller has the same origin as its
   *  parent frame. It MUST reject postMessage requests from any other source origin.
   *
   *  As specified in Section 4.1, the postMessage from the RP iframe delivers
   *  the following concatenation as the data:
   *
   *  Client ID + " " + Session State
   *  The OP iframe has access to Browser state at the OP (in a cookie or in
   *  HTML5 storage) that it uses to calculate and compare with the OP session state
   *  that was passed by the RP.
   *
   *  The OP iframe MUST recalculate it from the previously obtained Client ID,
   *  the source origin URL (from the postMessage), and the current OP Browser state.
   *  If the postMessage received is syntactically malformed in such a way that the
   *  posted Client ID and origin URL cannot be determined or are syntactically
   *  invalid, then the OP iframe SHOULD postMessage the string error back to the
   *  source. If the received value and the calculated value do not match, then the
   *  OP iframe MUST postMessage the string changed back to the source. If it
   *  matched, then it MUST postMessage the string unchanged.
   *
   *  Following is non-normative example pseudo-code for the OP iframe:
   *
   *    window.addEventListener("message", receiveMessage, false);
   *
   *    function receiveMessage(e){ // e has client_id and session_state
   *
   *      // Validate message origin
   *      client_id = e.data.split(' ')[0];
   *      session_state = e.data.split(' ')[1];
   *      var salt = session_state.split('.')[1];
   *
   *      // if message syntactically invalid
   *      //     postMessage('error', e.origin) and return
   *
   *      // get_op_browser_state() is an OP defined function
   *      // that returns the browser's login status at the OP.
   *      // How it is done is entirely up to the OP.
   *      var opbs = get_op_browser_state();
   *
   *      // Here, the session_state is calculated in this particular way,
   *      // but it is entirely up to the OP how to do it under the
   *      // requirements defined in this specification.
   *      var ss = CryptoJS.SHA256(client_id + ' ' + e.origin + ' ' +
   *        opbs + [' ' + salt]) [+ "." + salt];
   *
   *      if (e.session_state == ss) {
   *        stat = 'unchanged';
   *      } else {
   *        stat = 'changed';
   *      }
   *
   *      e.source.postMessage(stat, e.origin);
   *    };
   *  The OP browser state is typically going to be stored in a cookie or HTML5
   *  local storage. It is origin bound to the Authorization Server. It captures
   *  meaningful events such as logins, logouts, change of user, change of
   *  authentication status for Clients being used by the End-User, etc. Thus, the OP
   *  SHOULD update the value of the browser state in response to such meaningful
   *  events. As a result, the next call to check_session() after such an event will
   *  return the value changed. It is RECOMMENDED that the OP not update the browser
   *  state too frequently in the absence of meaningful events so as to spare
   *  excessive network traffic at the Client in response to spurious changed events.
   *
   *  The computation of the session state returned in response to unsuccessful
   *  Authentication Requests SHOULD, in addition to the browser state, incorporate
   *  sufficient randomness in the form of a salt so as to prevent identification of
   *  an End-User across successive calls to the OP's Authorization Endpoint.
   *
   *  In the case of an authorized Client (successful Authentication Response),
   *  the OP SHOULD change the value of the session state returned to the Client
   *  under one of the following events:
   *
   *  The set of users authenticated to the browser changes (login, logout,
   *  session add).
   *
   *  The authentication status of Clients being used by the
   *  End-User changes.
   *
   *  In addition, the browser state used to verify the session state SHOULD
   *  change with such events. Calls to check_session() will return changed against
   *  earlier versions of session state after such events. It is RECOMMENDED that the
   *  browser state SHOULD NOT vary too frequently in the absence of such events to
   *  minimize network traffic caused by the Client's response to changed
   *  notifications.
   *
   *  In the case of an unsuccessful Authentication Request, the value of the
   *  session state returned SHOULD vary with each request. However, the browser
   *  session state need not change unless a meaningful event happens. In particular,
   *  many values of session state can be simultaneously valid, for instance by the
   *  introduction of random salt in the session states issued in response to
   *  unsuccessful Authentication Requests.
   *
   *  If a cookie is used to maintain the OP browser state, the HttpOnly flag
   *  likely can't be set for this cookie, because it needs to be accessed from
   *  JavaScript. Therefore, information that can be used for identifying the user
   *  should not be put into the cookie, as it could be read by unrelated JavaScript.
   *
   *  In some implementations, changed notifications will occur only when changes
   *  to the End-User's session occur, whereas in other implementations, they might
   *  also occur as a result of changes to other sessions between the User Agent and
   *  the OP. RPs need to be prepared for either eventuality, silently handling any
   *  false positives that might occur.
   *
   */

  server.get('/session', function (req, res, next) {
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
  });

};

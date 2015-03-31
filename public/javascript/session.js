/**
 * bcrypt
 */

var bcrypt = dcodeIO.bcrypt;


/**
 * Handle RP Message
 */

function receiveMessage (e) {

  // Validate message origin
  var origin = e.origin;
  var parser = document.createElement('a');
  parser.href = document.referrer;
  messenger = parser.protocol + '//' + parser.host;
  if (origin !== messenger) {
    return; // Ignore the message
  }

  // Validate message syntax
  var parts         = e.data.split(' ');
  var client_id     = parts[0];
  var session_state = parts[1];
  var salt          = parts[2];

  if (parts.length !== 3) {
    e.source.postMessage('error', origin);
  }

  // get_op_browser_state() is an OP defined function
  // that returns the browser's login status at the OP.
  // How it is done is entirely up to the OP.
  //var opbs = get_op_browser_state();
  var opbs = 'authenticated';

  // Here, the session_state is calculated in this particular way,
  // but it is entirely up to the OP how to do it under the
  // requirements defined in this specification.
  //var ss = CryptoJS.SHA256(client_id + ' ' + e.origin + ' ' +
  //  opbs + [' ' + salt]) [+ "." + salt];
  var value = [client_id, origin, opbs, salt].join(' ')
  var hash = bcrypt.hashSync(value, salt);

  e.source.postMessage(
    (hash === session_state) ? 'unchanged' : 'changed' , origin
  );
};


/**
 * Register Listener
 */

window.addEventListener("message", receiveMessage, false);

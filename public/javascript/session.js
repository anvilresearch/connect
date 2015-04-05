/**
 * bcrypt
 */

var bcrypt = dcodeIO.bcrypt;


/**
 * Browser state
 */

function getOPBrowserState () {
  var re = new RegExp('[; ]anvil.connect.op.state=([^\\s;]*)');
  return document.cookie.match(re).pop();
}


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

  // Get the OP browser state
  var opbs = getOPBrowserState();

  // Locally calculated session state value for comparison
  var value = [client_id, origin, opbs, salt].join(' ')

  // Compare session state and reply to RP
  e.source.postMessage(
    (bcrypt.compareSync(value, session_state)) ? 'unchanged' : 'changed' , origin
  );
};


/**
 * Register Listener
 */

window.addEventListener("message", receiveMessage, false);

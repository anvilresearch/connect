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
  var sessionState  = parts[1];
  var salt          = sessionState.split('.')[1];

  if (parts.length !== 3) {
    e.source.postMessage('error', origin);
  }

  // Get the OP browser state
  var opbs = getOPBrowserState();

  // Locally calculated session state value for comparison
  var value = [client_id, origin, opbs, salt].join(' ');
  var localState = [CryptoJS.SHA256(value), salt].join('.');

  // Compare session state and reply to RP
  e.source.postMessage(
    (localState === sessionState) ? 'unchanged' : 'changed' , origin
  );
};


/**
 * Register Listener
 */

window.addEventListener("message", receiveMessage, false);

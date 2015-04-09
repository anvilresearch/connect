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

function receiveMessage (event) {

  // Parse message origin
  var origin  = event.origin;
  var parser  = document.createElement('a');
  parser.href = document.referrer;
  messenger   = parser.protocol + '//' + parser.host;

  // Ignore the message if origin doesn't match
  if (origin !== messenger) {
    return;
  }

  // Parse the message
  var client_id     = event.data.split(' ')[0];
  var sessionState  = event.data.split(' ')[1];
  var salt          = sessionState.split('.')[1];

  // Validate message syntax
  if (!client_id || !sessionState || !salt) {
    event.source.postMessage('error', origin);
  }

  // Get the OP browser state
  var opbs = getOPBrowserState();

  // Locally calculated session state value for comparison
  var value = [client_id, origin, opbs, salt].join(' ');
  var localState = [CryptoJS.SHA256(value), salt].join('.');

  // Compare session state and reply to RP
  event.source.postMessage(
    (localState === sessionState) ? 'unchanged' : 'changed' , origin
  );
};


/**
 * Register Listener
 */

window.addEventListener("message", receiveMessage, false);

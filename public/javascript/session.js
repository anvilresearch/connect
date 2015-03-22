window.addEventListener("message", receiveMessage, false);

function receiveMessage(e){ // e has client_id and session_state

  // Validate message origin
  client_id = e.data.split(' ')[0];
  session_state = e.data.split(' ')[1];
  var salt = session_state.split('.')[1];

  // if message syntactically invalid
  //     postMessage('error', e.origin) and return

  // get_op_browser_state() is an OP defined function
  // that returns the browser's login status at the OP.
  // How it is done is entirely up to the OP.
  var opbs = get_op_browser_state();

  // Here, the session_state is calculated in this particular way,
  // but it is entirely up to the OP how to do it under the
  // requirements defined in this specification.
  var ss = CryptoJS.SHA256(client_id + ' ' + e.origin + ' ' +
    opbs + [' ' + salt]) [+ "." + salt];

  if (e.session_state == ss) {
    stat = 'unchanged';
  } else {
    stat = 'changed';
  }

  e.source.postMessage(stat, e.origin);
};

/**
 * Set Session `amr` claim
 *
 * The `amr` claim is an OIDC ID Token property
 * used to indicate the type(s) of authentication
 * for the current session. This value is set when
 * users authenticate.
 */

function setSessionAmr (session, amr) {
  if (amr) {
    if (!Array.isArray(amr)) {
      session.amr = [amr]
    } else if (session.amr.indexOf(amr) === -1) {
      session.amr.push(amr)
    }
  }
}

/**
 * Export
 */

module.exports = setSessionAmr

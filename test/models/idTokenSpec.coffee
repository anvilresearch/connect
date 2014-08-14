# Test dependencies
cwd         = process.cwd()
path        = require 'path'
chai        = require 'chai'
sinon       = require 'sinon'
sinonChai   = require 'sinon-chai'
expect      = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
IDToken = require path.join cwd, 'models/IDToken'
JWT = require 'anvil-connect-jwt'
base64url = require 'base64url'




# OpenID Connect Core 1.0
#
# http://openid.net/specs/openid-connect-core-1_0.html#IDToken
#
# 2.  ID Token
#
# The primary extension that OpenID Connect makes to OAuth 2.0 to enable
# End-Users to be Authenticated is the ID Token data structure. The ID Token is a
# security token that contains Claims about the Authentication of an End-User by
# an Authorization Server when using a Client, and potentially other requested
# Claims. The ID Token is represented as a JSON Web Token (JWT) [JWT].
#
# The following Claims are used within the ID Token for all OAuth 2.0 flows
# used by OpenID Connect:
#
#   iss
#       REQUIRED. Issuer Identifier for the Issuer of the response. The iss
#       value is a case sensitive URL using the https scheme that contains scheme,
#       host, and optionally, port number and path components and no query or
#       fragment components.
#   sub
#       REQUIRED. Subject Identifier. A locally unique and never reassigned
#       identifier within the Issuer for the End-User, which is intended to be
#       consumed by the Client, e.g., 24400320 or
#       AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4. It MUST NOT exceed 255 ASCII
#       characters in length. The sub value is a case sensitive string.
#   aud
#       REQUIRED. Audience(s) that this ID Token is intended for. It MUST
#       contain the OAuth 2.0 client_id of the Relying Party as an audience value.
#       It MAY also contain identifiers for other audiences. In the general
#       case, the aud value is an array of case sensitive strings. In the
#       common special case when there is one audience, the aud value MAY be a
#       single case sensitive string.
#   exp
#       REQUIRED. Expiration time on or after which the ID Token MUST NOT be
#       accepted for processing. The processing of this parameter requires that
#       the current date/time MUST be before the expiration date/time listed in
#       the value. Implementers MAY provide for some small leeway, usually no more
#       than a few minutes, to account for clock skew. Its value is a JSON number
#       representing the number of seconds from 1970-01-01T0:0:0Z as measured in
#       UTC until the date/time. See RFC 3339 [RFC3339] for details regarding
#       date/times in general and UTC in particular.
#   iat
#       REQUIRED. Time at which the JWT was issued. Its value is a JSON number
#       representing the number of seconds from 1970-01-01T0:0:0Z as measured in
#       UTC until the date/time.
#   auth_time
#       Time when the End-User authentication occurred. Its value is a JSON
#       number representing the number of seconds from 1970-01-01T0:0:0Z as
#       measured in UTC until the date/time. When a max_age request is made or
#       when auth_time is requested as an Essential Claim, then this Claim is
#       REQUIRED; otherwise, its inclusion is OPTIONAL. (The auth_time Claim
#       semantically corresponds to the OpenID 2.0 PAPE [OpenID.PAPE] auth_time
#       response parameter.)
#   nonce
#       String value used to associate a Client session with an ID Token, and
#       to mitigate replay attacks. The value is passed through unmodified from
#       the Authentication Request to the ID Token. If present in the ID Token,
#       Clients MUST verify that the nonce Claim Value is equal to the value of
#       the nonce parameter sent in the Authentication Request. If present in the
#       Authentication Request, Authorization Servers MUST include a nonce Claim
#       in the ID Token with the Claim Value being the nonce value sent in the
#       Authentication Request. Authorization Servers SHOULD perform no other
#       processing on nonce values used. The nonce value is a case sensitive
#       string.
#   acr
#       OPTIONAL. Authentication Context Class Reference. String specifying an
#       Authentication Context Class Reference value that identifies the
#       Authentication Context Class that the authentication performed satisfied.
#       The value "0" indicates the End-User authentication did not meet the
#       requirements of ISO/IEC 29115 [ISO29115] level 1. Authentication using a
#       long-lived browser cookie, for instance, is one example where the use of
#       "level 0" is appropriate. Authentications with level 0 SHOULD NOT be used
#       to authorize access to any resource of any monetary value. (This
#       corresponds to the OpenID 2.0 PAPE [OpenID.PAPE] nist_auth_level 0.) An
#       absolute URI or an RFC 6711 [RFC6711] registered name SHOULD be used as
#       the acr value; registered names MUST NOT be used with a different meaning
#       than that which is registered. Parties using this claim will need to agree
#       upon the meanings of the values used, which may be context-specific. The
#       acr value is a case sensitive string.
#   amr
#       OPTIONAL. Authentication Methods References. JSON array of strings that
#       are identifiers for authentication methods used in the authentication. For
#       instance, values might indicate that both password and OTP authentication
#       methods were used. The definition of particular values to be used in the
#       amr Claim is beyond the scope of this specification. Parties using this
#       claim will need to agree upon the meanings of the values used, which may be
#       context-specific. The amr value is an array of case sensitive strings.
#   azp
#       OPTIONAL. Authorized party - the party to which the ID Token was
#       issued. If present, it MUST contain the OAuth 2.0 Client ID of this party.
#       This Claim is only needed when the ID Token has a single audience value
#       and that audience is different than the authorized party. It MAY be
#       included even when the authorized party is the same as the sole audience.
#       The azp value is a case sensitive string containing a StringOrURI value.
#
# ID Tokens MAY contain other Claims. Any Claims used that are not understood
# MUST be ignored. See Sections 3.1.3.6, 3.3.2.11, 5.1, and 7.4 for additional
# Claims defined by this specification.
#
# ID Tokens MUST be signed using JWS [JWS] and optionally both signed and then
# encrypted using JWS [JWS] and JWE [JWE] respectively, thereby providing
# authentication, integrity, non-repudiation, and optionally, confidentiality,
# per Section 16.14. If the ID Token is encrypted, it MUST be signed then
# encrypted, with the result being a Nested JWT, as defined in [JWT]. ID Tokens
# MUST NOT use none as the alg value unless the Response Type used returns no ID
# Token from the Authorization Endpoint (such as when using the Authorization
# Code Flow) and the Client explicitly requested the use of none at Registration
# time.
#
# ID Tokens SHOULD NOT use the JWS or JWE x5u, x5c, jku, or jwk header
# parameter fields. Instead, references to keys used are communicated in advance
# using Discovery and Registration parameters, per Section 10.
#
# The following is a non-normative example of the set of Claims (the JWT Claims
# Set) in an ID Token:
#
#  {
#   "iss": "https://server.example.com",
#   "sub": "24400320",
#   "aud": "s6BhdRkqt3",
#   "nonce": "n-0S6_WzA2Mj",
#   "exp": 1311281970,
#   "iat": 1311280970,
#   "auth_time": 1311280969,
#   "acr": "urn:mace:incommon:iap:silver"
#  }


describe 'ID Token', ->

  it 'should be a subclass of JWT', ->
    IDToken.super.should.equal JWT




  describe 'header', ->

    it 'must not use "none" as "alg" value', ->
      expect(-> new IDToken({}, { alg: 'none'})).to.throw Error

    it 'should not use "x5u", "x5c", "jku", or "jwk" header parameter fields', ->
      header =
        alg: 'RS256'
        x5u: 'x5u'
        x5c: 'x5c'
        jku: 'jku'
        jwk: 'jwk'
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'
        exp: Date.now()
        iat: Date.now()
      token = new IDToken payload, header
      expect(token.header.x5u).to.be.undefined
      expect(token.header.x5c).to.be.undefined
      expect(token.header.jku).to.be.undefined
      expect(token.header.jwk).to.be.undefined




  describe 'claims', ->

    it 'should require "iss" Issuer Identifier', ->
      IDToken.registeredClaims.iss.required.should.be.true

    it 'should require "sub" Subject Identifier', ->
      IDToken.registeredClaims.sub.required.should.be.true

    it 'should require "aud" Audience array or string'

    it 'should require "exp" Expiration time', ->
      IDToken.registeredClaims.exp.required.should.be.true

    it 'should default "exp" to 24 hours', ->
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'

      token = new IDToken payload
      token.payload.exp.should.be.a.number
      new Date(token.payload.exp).getDay().should.not.equal new Date().getDay()

    it 'should require "iat" Issued time', ->
      IDToken.registeredClaims.iat.required.should.be.true

    it 'should default "iat" to now', ->
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'
        exp: Date.now()

      token = new IDToken payload
      token.payload.iat.should.be.a.number

    it 'should conditionally require "auth_time"'

    it 'should include "nonce"', ->
      IDToken.registeredClaims.nonce.should.be.defined

    it 'should optionally include "acr"', ->
      IDToken.registeredClaims.acr.should.be.defined

    it 'should optionally include "amr"'
    it 'should optionally include "azp"'
    it 'should optionally include other claims defined by the specification'




  describe 'JWT encoded representation', ->

    it 'must be signed using JWS'




  describe 'encrypted representation', ->

    it 'must be a nested JWT'
    it 'must be signed using JWS'




  describe 'persistence', ->
  describe 'logging', ->
  describe 'issuance', ->





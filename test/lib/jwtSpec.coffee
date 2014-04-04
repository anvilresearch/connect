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
JWT = require path.join cwd, 'lib/JWT'
base64url = require 'base64url'




#   JSON Web Token (JWT)
#   draft-ietf-oauth-json-web-token-18
#
#   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18
#
#
#   3.  JSON Web Token (JWT) Overview
#
#   JWTs represent a set of claims as a JSON object that is encoded in a
#   JWS and/or JWE structure.  This JSON object is the JWT Claims Set. As
#   per Section 4 of [RFC7158], the JSON object consists of zero or more
#   name/value pairs (or members), where the names are strings and the
#   values are arbitrary JSON values.  These members are the claims
#   represented by the JWT.
#
#   The member names within the JWT Claims Set are referred to as Claim
#   Names.  The corresponding values are referred to as Claim Values.
#
#   The contents of the JWT Header describe the cryptographic operations
#   applied to the JWT Claims Set. If the JWT Header is a JWS Header, the
#   JWT is represented as a JWS, and the claims are digitally signed or
#   MACed, with the JWT Claims Set being the JWS Payload.  If the JWT
#   Header is a JWE Header, the JWT is represented as a JWE, and the
#   claims are encrypted, with the JWT Claims Set being the input
#   Plaintext.  A JWT may be enclosed in another JWE or JWS structure to
#   create a Nested JWT, enabling nested signing and encryption to be
#   performed.
#
#   A JWT is represented as a sequence of URL-safe parts separated by
#   period ('.') characters.  Each part contains a base64url encoded
#   value.  The number of parts in the JWT is dependent upon the
#   representation of the resulting JWS or JWE object using the JWS
#   Compact Serialization or the JWE Compact Serialization.




describe 'JWT', ->



  describe 'traverse', ->

    {keys,schema,operation,descriptorA} = {}

    beforeEach ->
      keys = ['a','b']
      descriptorA = { format: 'String' }
      descriptorB = { format: 'String' }
      schema =
        a: descriptorA
        b: descriptorB
      operation = sinon.spy()

    it 'should not traverse an undefined source', ->
      JWT.traverse(keys, schema, undefined, {}, operation, {})
      operation.should.not.have.been.called

    it 'should not traverse a null source', ->
      JWT.traverse(keys, schema, null, {}, operation, {})
      operation.should.not.have.been.called

    it 'should iterate over a set of keys', ->
      JWT.traverse(keys, schema, {}, {}, operation, {})
      operation.should.have.been.calledWith 'a'
      operation.should.have.been.calledWith 'b'

    it 'should fail with unrecognized schema properties', ->
      expect(-> JWT.traverse(['x'], {}, {}, {}, (->), {})).to.throw Error

    it 'should ignore unrecognized source properties', ->
      JWT.traverse(keys, schema, { x: 'x' }, {}, operation, {})
      operation.should.not.have.been.calledWith 'x'

    it 'should operate on a target object', ->
      source = { a: 'a', b: 'b' }
      target = {}
      options = {}
      JWT.traverse(keys, schema, source, target, operation, options)
      operation.should.have.been.calledWith 'a', descriptorA, source, target, options




  describe 'assignValid', ->

    {key,descriptor,source,target,options} = {}

    beforeEach ->
      key = 'a'
      descriptor = format: 'String'
      source = { a: 'a' }
      target = {}
      options = {}

    it 'should set a target property from a source object', ->
      JWT.assignValid(key, descriptor, source, target, options)
      target.a.should.equal source.a

    it 'should set a target property from a source object by mapping', ->
      descriptor =
        format: 'String'
        from: 'a'
      JWT.assignValid('b', descriptor, source, target, options)
      target.b.should.equal source.a

    it 'should set a target property from a default value', ->
      descriptor =
        format: 'String'
        default: 'd'
      JWT.assignValid('b', descriptor, source, target, options)
      target.b.should.equal descriptor.default

    it 'should set a target property from a default function', ->
      descriptor =
        format: 'String'
        default: -> 'generated'
      JWT.assignValid('b', descriptor, source, target, options)
      target.b.should.equal 'generated'

    it 'should fail with an invalid format', ->
      source = { a: 1 }
      expect(-> JWT.assignValid(key, descriptor, source, target, options)).to.throw Error

    it 'should fail with an unenumerated value', ->
      descriptor =
        format: 'String'
        enum: ['x','y']
      expect(-> JWT.assignValid(key, descriptor, source, target, options)).to.throw Error

    it 'should fail with an undefined required property', ->
      descriptor =
        format: 'String'
        required: true
      expect(-> JWT.assignValid(key, descriptor, {}, target, options)).to.throw Error




  describe 'assertFormat', ->

    it 'should verify a value matching a prescribed format', ->
      JWT.assertFormat('key', 123456789, { format: 'IntDate' }).should.be.true

    it 'should fail with a value not matching a prescribed format', ->
      expect(-> JWT.assertFormat('key', false, { format: 'IntDate' })).to.throw Error

    it 'should fail with an unrecognized format', ->
      expect(-> JWT.assertFormat('key', false, { format: 'Unknown' })).to.throw Error




  describe 'StringOrURI', ->

    it 'should accept a string', ->
      JWT.formats['StringOrURI']('string').should.be.true

    it 'should accept a valid URI', ->
      JWT.formats['StringOrURI']("http://anvil.io").should.be.true
      JWT.formats['StringOrURI']("anvil.io").should.be.true

    it 'should not accept an invalid URI', ->
      JWT.formats['StringOrURI']("http://an%vil.io").should.be.false
      #JWT.formats['StringOrURI']("an%vil.io").should.be.false

    it 'should not accept a non-string', ->
      JWT.formats['StringOrURI'](true).should.be.false
      JWT.formats['StringOrURI'](123).should.be.false
      JWT.formats['StringOrURI']([]).should.be.false
      JWT.formats['StringOrURI']({}).should.be.false
      JWT.formats['StringOrURI'](->).should.be.false
      JWT.formats['StringOrURI'](null).should.be.false




  describe 'StringOrURI*', ->


  describe 'String', ->

    it 'should accept a string', ->
      JWT.formats['String']('true').should.be.true

    it 'should not accept a non-string', ->
      JWT.formats['String'](false).should.be.false




  describe 'CaseSensitiveString', ->





  describe 'IntDate', ->

    it 'should accept a valid integer', ->
      JWT.formats['IntDate'](Date.now()).should.be.true

    it 'should not accept a non-integer', ->
      JWT.formats['IntDate'](null).should.be.false
      JWT.formats['IntDate'](true).should.be.false
      JWT.formats['IntDate'](123.45).should.be.false
      JWT.formats['IntDate']('foo').should.be.false
      JWT.formats['IntDate'](->).should.be.false
      JWT.formats['IntDate']({}).should.be.false




  describe 'URI', ->

    it 'should accept a valid URI', ->
      JWT.formats['URI']("http://anvil.io").should.be.true
      JWT.formats['URI']("anvil.io").should.be.true

    it 'should not accept an invalid URI', ->
      JWT.formats['URI']("http://an%vil.io").should.be.false
      JWT.formats['URI']("an%vil.io").should.be.false




  describe 'JWK', ->
  describe 'CertificateOrChain', ->
  describe 'CertificateThumbprint', ->
  describe 'ParameterList', ->




  describe 'assertEnumerated', ->

    it 'should verify an enumerated value', ->
      JWT.assertEnumerated('key', 'z', {
        format: 'String',
        enum: ['x','y','z']
      }).should.be.true

    it 'should fail with an unenumerated value', ->
      expect(-> JWT.assertEnumerated('key', 'z', {
        format: 'String'
        enum: ['x','y']
      })).to.throw Error





  describe 'assertPresence', ->

    it 'should verify the presence of a required value', ->
      JWT.assertPresence('key', 'value', { required: true }).should.be.true

    it 'should not fail if a value is not required', ->
      JWT.assertPresence('key', undefined, {}).should.be.true

    it 'should fail with an absent required value', ->
      expect(-> JWT.assertPresence('key', undefined, { required: true })).to.throw Error




  describe 'header initialization', ->

    {header,constructor,instance} = {}


    before ->
      header =
        alg: 'none'
      constructor =
        headers: ['alg'],
        registeredHeaders: JWT.registeredHeaders
      instance = {constructor}
      sinon.spy(JWT, 'traverse')
      JWT.prototype.initializeHeader.call(instance, { alg: 'none' })

    after ->
      JWT.traverse.restore()

    it 'should assign a valid set of parameters', ->
      JWT.traverse.should.have.been.calledWith(
        constructor.headers
        constructor.registeredHeaders
        header
        instance.header
        JWT.assignValid
      )

    it 'should base64url encode the header', ->
      base64url.decode(instance.headerB64u).should.equal JSON.stringify(header)



  describe 'payload initialization', ->

    {payload,constructor,instance} = {}

    before ->
      payload =
        iss: 'http://anvil.io'
      constructor =
        claims: ['iss'],
        registeredClaims: JWT.registeredClaims
      instance = {constructor}
      sinon.spy(JWT, 'traverse')
      JWT.prototype.initializePayload.call(instance, payload)

    after ->
      JWT.traverse.restore()

    it 'should assign a valid set of claims', ->
      JWT.traverse.should.have.been.calledWith(
        constructor.claims
        constructor.registeredClaims
        payload
        instance.payload
        JWT.assignValid
      )



  describe 'constructor', ->

    {payload,header} = {}

    before ->
      payload = { iss: 'http://anvil.io' }
      header = { alg: 'none' }
      sinon.spy(JWT.prototype, 'initializeHeader')
      sinon.spy(JWT.prototype, 'initializePayload')
      new JWT(payload, header)

    after ->
      JWT.prototype.initializeHeader.restore()
      JWT.prototype.initializePayload.restore()


    it 'should initialize the provided header if provided', ->
      JWT.prototype.initializeHeader.should.have.been.calledWith header

    it 'should initialize the provided payload', ->
      JWT.prototype.initializePayload.should.have.been.calledWith payload

    it 'should initialize a signature if provided'




  #   3.1.  "alg" (Algorithm) Header Parameter Values for JWS
  #
  #   http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-23#section-3.1
  #
  #   The table below is the set of "alg" (algorithm) header parameter
  #   values defined by this specification for use with JWS, each of which
  #   is explained in more detail in the following sections:
  #
  #   +---------------+------------------------------+--------------------+
  #   | alg Parameter | Digital Signature or MAC     | Implementation     |
  #   | Value         | Algorithm                    | Requirements       |
  #   +---------------+------------------------------+--------------------+
  #   | HS256         | HMAC using SHA-256           | Required           |
  #   | HS384         | HMAC using SHA-384           | Optional           |
  #   | HS512         | HMAC using SHA-512           | Optional           |
  #   | RS256         | RSASSA-PKCS-v1_5 using       | Recommended        |
  #   |               | SHA-256                      |                    |
  #   | RS384         | RSASSA-PKCS-v1_5 using       | Optional           |
  #   |               | SHA-384                      |                    |
  #   | RS512         | RSASSA-PKCS-v1_5 using       | Optional           |
  #   |               | SHA-512                      |                    |
  #   | ES256         | ECDSA using P-256 and        | Recommended+       |
  #   |               | SHA-256                      |                    |
  #   | ES384         | ECDSA using P-384 and        | Optional           |
  #   |               | SHA-384                      |                    |
  #   | ES512         | ECDSA using P-521 and        | Optional           |
  #   |               | SHA-512                      |                    |
  #   | PS256         | RSASSA-PSS using SHA-256 and | Optional           |
  #   |               | MGF1 with SHA-256            |                    |
  #   | PS384         | RSASSA-PSS using SHA-384 and | Optional           |
  #   |               | MGF1 with SHA-384            |                    |
  #   | PS512         | RSASSA-PSS using SHA-512 and | Optional           |
  #   |               | MGF1 with SHA-512            |                    |
  #   | none          | No digital signature or MAC  | Optional           |
  #   |               | performed                    |                    |
  #   +---------------+------------------------------+--------------------+
  #
  #   The use of "+" in the Implementation Requirements indicates that the
  #   requirement strength is likely to be increased in a future version of
  #   the specification.
  #
  #   See Appendix A.1 for a table cross-referencing the JWS digital
  #   signature and MAC "alg" (algorithm) values defined in this
  #   specification with the equivalent identifiers used by other standards
  #   and software packages.

  describe 'supported algorithms', ->

    it 'should be enumerated', ->
      JWT.algorithms.should.be.an.array




  #   4.  JWT Claims
  #
  #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4
  #
  #   The JWT Claims Set represents a JSON object whose members are the
  #   claims conveyed by the JWT.  The Claim Names within a JWT Claims Set
  #   MUST be unique; recipients MUST either reject JWTs with duplicate
  #   Claim Names or use a JSON parser that returns only the lexically last
  #   duplicate member name, as specified in Section 15.12 (The JSON
  #   Object) of ECMAScript 5.1 [ECMAScript].
  #
  #   The set of claims that a JWT must contain to be considered valid is
  #   context-dependent and is outside the scope of this specification.
  #   Specific applications of JWTs will require implementations to
  #   understand and process some claims in particular ways.  However, in
  #   the absence of such requirements, all claims that are not understood
  #   by implementations MUST be ignored.
  #
  #   There are three classes of JWT Claim Names: Registered Claim Names,
  #   Public Claim Names, and Private Claim Names.
  #
  #   4.1.  Registered Claim Names
  #
  #   The following Claim Names are registered in the IANA JSON Web Token
  #   Claims registry defined in Section 10.1.  None of the claims defined
  #   below are intended to be mandatory to use or implement in all cases,
  #   but rather, provide a starting point for a set of useful,
  #   interoperable claims.  Applications using JWTs should define which
  #   specific claims they use and when they are required or optional.  All
  #   the names are short because a core goal of JWTs is for the
  #   representation to be compact.

  describe 'registered claims', ->




    #   4.1.1.  "iss" (Issuer) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.1
    #
    #   The "iss" (issuer) claim identifies the principal that issued the
    #   JWT.  The processing of this claim is generally application specific.
    #   The "iss" value is a case-sensitive string containing a StringOrURI
    #   value.  Use of this claim is OPTIONAL.

    it 'should specify "iss" as a StringOrURI', ->
      JWT.registeredClaims.iss.format.should.equal 'StringOrURI'




    #   4.1.2.  "sub" (Subject) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.2
    #
    #   The "sub" (subject) claim identifies the principal that is the
    #   subject of the JWT.  The Claims in a JWT are normally statements
    #   about the subject.  The subject value MAY be scoped to be locally
    #   unique in the context of the issuer or MAY be globally unique.  The
    #   processing of this claim is generally application specific.  The
    #   "sub" value is a case-sensitive string containing a StringOrURI
    #   value.  Use of this claim is OPTIONAL.

    it 'should specify "sub" as a StringOrURI', ->
      JWT.registeredClaims.sub.format.should.equal 'StringOrURI'




    #   4.1.3.  "aud" (Audience) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.3
    #
    #   The "aud" (audience) claim identifies the recipients that the JWT is
    #   intended for.  Each principal intended to process the JWT MUST
    #   identify itself with a value in the audience claim.  If the principal
    #   processing the claim does not identify itself with a value in the
    #   "aud" claim when this claim is present, then the JWT MUST be
    #   rejected.  In the general case, the "aud" value is an array of case-
    #   sensitive strings, each containing a StringOrURI value.  In the
    #   special case when the JWT has one audience, the "aud" value MAY be a
    #   single case-sensitive string containing a StringOrURI value.  The
    #   interpretation of audience values is generally application specific.
    #   Use of this claim is OPTIONAL.

    it 'should specify "aud" as an array of StringOrURI values', ->
      JWT.registeredClaims.aud.format.should.equal 'StringOrURI*'




    #   4.1.4.  "exp" (Expiration Time) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.4
    #
    #   The "exp" (expiration time) claim identifies the expiration time on
    #   or after which the JWT MUST NOT be accepted for processing.  The
    #   processing of the "exp" claim requires that the current date/time
    #   MUST be before the expiration date/time listed in the "exp" claim.
    #   Implementers MAY provide for some small leeway, usually no more than
    #   a few minutes, to account for clock skew.  Its value MUST be a number
    #   containing an IntDate value.  Use of this claim is OPTIONAL.

    it 'should specify "exp" as an IntDate', ->
      JWT.registeredClaims.exp.format.should.equal 'IntDate'




    #   4.1.5.  "nbf" (Not Before) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.5
    #
    #   The "nbf" (not before) claim identifies the time before which the JWT
    #   MUST NOT be accepted for processing.  The processing of the "nbf"
    #   claim requires that the current date/time MUST be after or equal to
    #   the not-before date/time listed in the "nbf" claim.  Implementers MAY
    #   provide for some small leeway, usually no more than a few minutes, to
    #   account for clock skew.  Its value MUST be a number containing an
    #   IntDate value.  Use of this claim is OPTIONAL.

    it 'should specify "nbf" as an IntDate', ->
      JWT.registeredClaims.nbf.format.should.equal 'IntDate'




    #   4.1.6.  "iat" (Issued At) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.6
    #
    #   The "iat" (issued at) claim identifies the time at which the JWT was
    #   issued.  This claim can be used to determine the age of the JWT.  Its
    #   value MUST be a number containing an IntDate value.  Use of this
    #   claim is OPTIONAL.

    it 'should specify "iat" as an IntDate', ->
      JWT.registeredClaims.iat.format.should.equal 'IntDate'




    #   4.1.7.  "jti" (JWT ID) Claim
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4.1.7
    #
    #   The "jti" (JWT ID) claim provides a unique identifier for the JWT.
    #   The identifier value MUST be assigned in a manner that ensures that
    #   there is a negligible probability that the same value will be
    #   accidentally assigned to a different data object.  The "jti" claim
    #   can be used to prevent the JWT from being replayed.  The "jti" value
    #   is a case-sensitive string.  Use of this claim is OPTIONAL.

    it 'should specify "jti" as a case-sensitive string', ->
      JWT.registeredClaims.jti.format.should.equal 'CaseSensitiveString'




    #   4.2.  Public Claim Names
    #
    #   Claim Names can be defined at will by those using JWTs.  However, in
    #   order to prevent collisions, any new Claim Name should either be
    #   registered in the IANA JSON Web Token Claims registry defined in
    #   Section 10.1 or be a Public Name: a value that contains a Collision-
    #   Resistant Name.  In each case, the definer of the name or value needs
    #   to take reasonable precautions to make sure they are in control of
    #   the part of the namespace they use to define the Claim Name.
    #
    #   4.3.  Private Claim Names
    #
    #   A producer and consumer of a JWT MAY agree to use Claim Names that
    #   are Private Names: names that are not Registered Claim Names
    #   Section 4.1 or Public Claim Names Section 4.2.  Unlike Public Claim
    #   Names, Private Claim Names are subject to collision and should be
    #   used with caution.




  #   5.  JWT Header
  #
  #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-5
  #
  #   The members of the JSON object represented by the JWT Header describe
  #   the cryptographic operations applied to the JWT and optionally,
  #   additional properties of the JWT.  The member names within the JWT
  #   Header are referred to as Header Parameter Names.  These names MUST
  #   be unique; recipients MUST either reject JWTs with duplicate Header
  #   Parameter Names or use a JSON parser that returns only the lexically
  #   last duplicate member name, as specified in Section 15.12 (The JSON
  #   Object) of ECMAScript 5.1 [ECMAScript].  The corresponding values are
  #   referred to as Header Parameter Values.
  #
  #   JWS Header Parameters are defined by [JWS].  JWE Header Parameters
  #   are defined by [JWE].  This specification further specifies the use
  #   of the following Header Parameters in both the cases where the JWT is
  #   a JWS and where it is a JWE.

  describe 'registered headers', ->




    #   4.1.1.  "alg" (Algorithm) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.1
    #
    #   The "alg" (algorithm) Header Parameter identifies the cryptographic
    #   algorithm used to secure the JWS.  The signature, MAC, or plaintext
    #   value is not valid if the "alg" value does not represent a supported
    #   algorithm, or if there is not a key for use with that algorithm
    #   associated with the party that digitally signed or MACed the content.
    #   "alg" values should either be registered in the IANA JSON Web
    #   Signature and Encryption Algorithms registry defined in [JWA] or be a
    #   value that contains a Collision-Resistant Name.  The "alg" value is a
    #   case-sensitive string containing a StringOrURI value.  This Header
    #   Parameter MUST be present and MUST be understood and processed by
    #   implementations.

    #   A list of defined "alg" values for this use can be found in the IANA
    #   JSON Web Signature and Encryption Algorithms registry defined in
    #   [JWA]; the initial contents of this registry are the values defined
    #   in Section 3.1 of the JSON Web Algorithms (JWA) [JWA] specification.

    it 'should specify "alg" to be required', ->
      JWT.registeredHeaders.alg.required.should.equal true

    it 'should specify "alg" to be a StringOrURI', ->
      JWT.registeredHeaders.alg.format.should.equal 'StringOrURI'

    it 'should specify "alg" to require a supported algorithm', ->
      JWT.registeredHeaders.alg.enum.should.eql JWT.algorithms




    #   5.1.  "typ" (Type) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-5.1
    #
    #   The "typ" (type) Header Parameter defined by [JWS] and [JWE] is used
    #   to declare the MIME Media Type [IANA.MediaTypes] of this complete JWT
    #   in contexts where this is useful to the application.  This parameter
    #   has no effect upon the JWT processing.  If present, it is RECOMMENDED
    #   that its value be "JWT" to indicate that this object is a JWT.  While
    #   media type names are not case-sensitive, it is RECOMMENDED that "JWT"
    #   always be spelled using uppercase characters for compatibility with
    #   legacy implementations.  Use of this Header Parameter is OPTIONAL.

    #   4.1.8.  "typ" (Type) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.8
    #
    #   The "typ" (type) Header Parameter is used to declare the MIME Media
    #   Type [IANA.MediaTypes] of this complete JWS object in contexts where
    #   this is useful to the application.  This parameter has no effect upon
    #   the JWS processing.  Use of this Header Parameter is OPTIONAL.
    #
    #   Per [RFC2045], all media type values, subtype values, and parameter
    #   names are case-insensitive.  However, parameter values are case-
    #   sensitive unless otherwise specified for the specific parameter.
    #
    #   To keep messages compact in common situations, it is RECOMMENDED that
    #   senders omit an "application/" prefix of a media type value in a
    #   "typ" Header Parameter when no other '/' appears in the media type
    #   value.  A recipient using the media type value MUST treat it as if
    #   "application/" were prepended to any "typ" value not containing a
    #   '/'.  For instance, a "typ" value of "example" SHOULD be used to
    #   represent the "application/example" media type; whereas, the media
    #   type "application/example;part="1/2"" cannot be shortened to
    #   "example;part="1/2"".
    #
    #   The "typ" value "JOSE" can be used by applications to indicate that
    #   this object is a JWS or JWE using the JWS Compact Serialization or
    #   the JWE Compact Serialization.  The "typ" value "JOSE+JSON" can be
    #   used by applications to indicate that this object is a JWS or JWE
    #   using the JWS JSON Serialization or the JWE JSON Serialization.
    #   Other type values can also be used by applications.

    it 'should specify "typ" to be a String', ->
      JWT.registeredHeaders.typ.format.should.equal 'String'

    it 'should specify "typ" to default to "JWT"', ->
      JWT.registeredHeaders.typ.default.should.equal 'JWT'




    #   5.2.  "cty" (Content Type) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-5.2
    #
    #   The "cty" (content type) Header Parameter defined by [JWS] and [JWE]
    #   is used by this specification to convey structural information about
    #   the JWT.
    #
    #   In the normal case where nested signing or encryption operations are
    #   not employed, the use of this Header Parameter is NOT RECOMMENDED.
    #   In the case that nested signing or encryption is employed, this
    #   Header Parameter MUST be present; in this case, the value MUST be
    #   "JWT", to indicate that a Nested JWT is carried in this JWT.  While
    #   media type names are not case-sensitive, it is RECOMMENDED that "JWT"
    #   always be spelled using uppercase characters for compatibility with
    #   legacy implementations.  See Appendix A.2 for an example of a Nested
    #   JWT.

    #   4.1.9.  "cty" (Content Type) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.9
    #
    #   The "cty" (content type) Header Parameter is used to declare the MIME
    #   Media Type [IANA.MediaTypes] of the secured content (the payload) in
    #   contexts where this is useful to the application.  This parameter has
    #   no effect upon the JWS processing.  Use of this Header Parameter is
    #   OPTIONAL.
    #
    #   Per [RFC2045], all media type values, subtype values, and parameter
    #   names are case-insensitive.  However, parameter values are case-
    #   sensitive unless otherwise specified for the specific parameter.
    #
    #   To keep messages compact in common situations, it is RECOMMENDED that
    #   senders omit an "application/" prefix of a media type value in a
    #   "cty" Header Parameter when no other '/' appears in the media type
    #   value.  A recipient using the media type value MUST treat it as if
    #   "application/" were prepended to any "cty" value not containing a
    #   '/'.  For instance, a "cty" value of "example" SHOULD be used to
    #   represent the "application/example" media type; whereas, the media
    #   type "application/example;part="1/2"" cannot be shortened to
    #   "example;part="1/2"".

    it 'should specify "cty" to be a String', ->
      JWT.registeredHeaders.cty.format.should.equal 'String'

    it 'should specify "cty" to require "JWT" as the value', ->
      JWT.registeredHeaders.cty.enum.length.should.equal 1
      JWT.registeredHeaders.cty.enum.should.contain 'JWT'

    it 'should specify "cty" to be required if the JWT is nested'




    #   4.1.2.  "jku" (JWK Set URL) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.2
    #
    #   The "jku" (JWK Set URL) Header Parameter is a URI [RFC3986] that
    #   refers to a resource for a set of JSON-encoded public keys, one of
    #   which corresponds to the key used to digitally sign the JWS.  The
    #   keys MUST be encoded as a JSON Web Key Set (JWK Set) [JWK].  The
    #   protocol used to acquire the resource MUST provide integrity
    #   protection; an HTTP GET request to retrieve the JWK Set MUST use TLS
    #   [RFC2818] [RFC5246]; the identity of the server MUST be validated, as
    #   per Section 3.1 of HTTP Over TLS [RFC2818].  Use of this Header
    #   Parameter is OPTIONAL.

    it 'should specify "jku" to be a URI', ->
      JWT.registeredHeaders.jku.format.should.equal 'URI'




    #   4.1.3.  "jwk" (JSON Web Key) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.3
    #
    #   The "jwk" (JSON Web Key) Header Parameter is the public key that
    #   corresponds to the key used to digitally sign the JWS.  This key is
    #   represented as a JSON Web Key [JWK].  Use of this Header Parameter is
    #   OPTIONAL.

    it 'should specify "jwk" to be a JWK', ->
      JWT.registeredHeaders.jwk.format.should.equal 'JWK'




    #   4.1.4.  "kid" (Key ID) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.4
    #
    #   The "kid" (key ID) Header Parameter is a hint indicating which key
    #   was used to secure the JWS.  This parameter allows originators to
    #   explicitly signal a change of key to recipients.  The structure of
    #   the "kid" value is unspecified.  Its value MUST be a string.  Use of
    #   this Header Parameter is OPTIONAL.
    #
    #   When used with a JWK, the "kid" value is used to match a JWK "kid"
    #   parameter value.

    it 'should specify "kid" to be a String', ->
      JWT.registeredHeaders.kid.format.should.equal 'String'




    #   4.1.5.  "x5u" (X.509 URL) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.5
    #
    #   The "x5u" (X.509 URL) Header Parameter is a URI [RFC3986] that refers
    #   to a resource for the X.509 public key certificate or certificate
    #   chain [RFC5280] corresponding to the key used to digitally sign the
    #   JWS.  The identified resource MUST provide a representation of the
    #   certificate or certificate chain that conforms to RFC 5280 [RFC5280]
    #   in PEM encoded form [RFC1421].  The certificate containing the public
    #   key corresponding to the key used to digitally sign the JWS MUST be
    #   the first certificate.  This MAY be followed by additional
    #   certificates, with each subsequent certificate being the one used to
    #   certify the previous one.  The protocol used to acquire the resource
    #   MUST provide integrity protection; an HTTP GET request to retrieve
    #   the certificate MUST use TLS [RFC2818] [RFC5246]; the identity of the
    #   server MUST be validated, as per Section 3.1 of HTTP Over TLS
    #   [RFC2818].  Use of this Header Parameter is OPTIONAL.

    it 'should specify "x5u" to be a URI', ->
      JWT.registeredHeaders.x5u.format.should.equal 'URI'




    #   4.1.6.  "x5c" (X.509 Certificate Chain) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.6
    #
    #   The "x5c" (X.509 Certificate Chain) Header Parameter contains the
    #   X.509 public key certificate or certificate chain [RFC5280]
    #   corresponding to the key used to digitally sign the JWS.  The
    #   certificate or certificate chain is represented as a JSON array of
    #   certificate value strings.  Each string in the array is a base64
    #   encoded ([RFC4648] Section 4 -- not base64url encoded) DER
    #   [ITU.X690.1994] PKIX certificate value.  The certificate containing
    #   the public key corresponding to the key used to digitally sign the
    #   JWS MUST be the first certificate.  This MAY be followed by
    #   additional certificates, with each subsequent certificate being the
    #   one used to certify the previous one.  The recipient MUST validate
    #   the certificate chain according to [RFC5280] and reject the signature
    #   if any validation failure occurs.  Use of this Header Parameter is
    #   OPTIONAL.
    #
    #   See Appendix B for an example "x5c" value.

    it 'should specify "x5c" to be a CertificateOrChain', ->
      JWT.registeredHeaders.x5c.format.should.equal 'CertificateOrChain'




    #   4.1.7.  "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.7
    #
    #   The "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter is a
    #   base64url encoded SHA-1 thumbprint (a.k.a. digest) of the DER
    #   encoding of the X.509 certificate [RFC5280] corresponding to the key
    #   used to digitally sign the JWS.  Use of this Header Parameter is
    #   OPTIONAL.
    #
    #   If, in the future, certificate thumbprints need to be computed using
    #   hash functions other than SHA-1, it is suggested that additional
    #   related Header Parameters be defined for that purpose.  For example,
    #   it is suggested that a new "x5t#S256" (X.509 Certificate Thumbprint
    #   using SHA-256) Header Parameter could be defined by registering it in
    #   the IANA JSON Web Signature and Encryption Header Parameters registry
    #   defined in Section 9.1.

    it 'should specify "x5t" to be a CertificateThumbprint', ->
      JWT.registeredHeaders.x5t.format.should.equal 'CertificateThumbprint'




    #   4.1.10.  "crit" (Critical) Header Parameter
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-4.1.10
    #
    #   The "crit" (critical) Header Parameter indicates that extensions to
    #   the initial RFC versions of [[ this specification ]] and [JWA] are
    #   being used that MUST be understood and processed.  Its value is an
    #   array listing the Header Parameter names present in the JWS Header
    #   that use those extensions.  If any of the listed extension Header
    #   Parameters are not understood and supported by the receiver, it MUST
    #   reject the JWS.  Senders MUST NOT include Header Parameter names
    #   defined by the initial RFC versions of [[ this specification ]] or
    #   [JWA] for use with JWS, duplicate names, or names that do not occur
    #   as Header Parameter names within the JWS Header in the "crit" list.
    #   Senders MUST NOT use the empty list "[]" as the "crit" value.
    #   Recipients MAY reject the JWS if the critical list contains any
    #   Header Parameter names defined by the initial RFC versions of [[ this
    #   specification ]] or [JWA] for use with JWS, or any other constraints
    #   on its use are violated.  This Header Parameter MUST be integrity
    #   protected, and therefore MUST occur only within the JWS Protected
    #   Header, when used.  Use of this Header Parameter is OPTIONAL.  This
    #   Header Parameter MUST be understood and processed by implementations.
    #
    #   An example use, along with a hypothetical "exp" (expiration-time)
    #   field is:
    #
    #     {"alg":"ES256",
    #      "crit":["exp"],
    #      "exp":1363284000
    #     }

    it 'should specify "crit" to be a ParameterList', ->
      JWT.registeredHeaders.crit.format.should.equal 'ParameterList'




  describe 'define', ->

    {MyJWT,header,headers,claims} = {}

    before ->
      registeredHeaders =
        alg: { format: 'String', enum: ['RS256'] }
        new: { format: 'IntDate' }

      registeredClaims =
        iss: { format: 'StringOrURI', required: true }

      header = { alg: 'RS256' }
      headers = ['alg']
      claims = ['iss', 'sub', 'aud']

      MyJWT = JWT.define {
        registeredHeaders
        registeredClaims
        headers
        header
        claims
      }

    it 'should return a subclass of JWT', ->
      expect(new MyJWT).to.be.instanceof JWT

    it 'should set the correct constructor', ->
      MyJWT.prototype.constructor.should.equal MyJWT

    it 'should register header definitions', ->
      MyJWT.registeredHeaders.alg.enum.length.should.equal 1
      #MyJWT.registeredHeaders.alg.required.should.equal true
      #MyJWT.registeredHeaders.alg.format.should.equal 'StringOrURI'
      MyJWT.registeredHeaders.new.format.should.equal 'IntDate'

    it 'should register claim definitions', ->
      MyJWT.registeredClaims.iss.required.should.equal true

    it 'should select applicable headers', ->
      MyJWT.headers.should.equal headers

    it 'should select applicable claims', ->
      MyJWT.claims.should.equal claims

    it 'should initialize a default header', ->
      MyJWT.prototype.header.alg.should.equal header.alg
      MyJWT.prototype.headerB64u.should.equal base64url(JSON.stringify(header))




  #   7.  Rules for Creating and Validating a JWT
  #
  #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-7
  #
  #   To create a JWT, the following steps MUST be taken.  The order of the
  #   steps is not significant in cases where there are no dependencies
  #   between the inputs and outputs of the steps.
  #
  #   1.  Create a JWT Claims Set containing the desired claims.  Note that
  #       white space is explicitly allowed in the representation and no
  #       canonicalization need be performed before encoding.
  #
  #   2.  Let the Message be the octets of the UTF-8 representation of the
  #       JWT Claims Set.
  #
  #   3.  Create a JWT Header containing the desired set of Header
  #       Parameters.  The JWT MUST conform to either the [JWS] or [JWE]
  #       specifications.  Note that white space is explicitly allowed in
  #       the representation and no canonicalization need be performed
  #       before encoding.
  #
  #   4.  Depending upon whether the JWT is a JWS or JWE, there are two
  #       cases:
  #
  #       *  If the JWT is a JWS, create a JWS using the JWT Header as the
  #          JWS Header and the Message as the JWS Payload; all steps
  #          specified in [JWS] for creating a JWS MUST be followed.
  #
  #       *  Else, if the JWT is a JWE, create a JWE using the JWT Header
  #          as the JWE Header and the Message as the JWE Plaintext; all
  #          steps specified in [JWE] for creating a JWE MUST be followed.
  #
  #   5.  If a nested signing or encryption operation will be performed,
  #       let the Message be the JWS or JWE, and return to Step 3, using a
  #       "cty" (content type) value of "JWT" in the new JWT Header created
  #       in that step.
  #
  #   6.  Otherwise, let the resulting JWT be the JWS or JWE.

  describe 'encode', ->

    it 'should assert the presence of a payload'
    it 'should ensure the presence of a header'


    #   4.  JWT Claims
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-4
    #
    #   [...]
    #
    #   The set of claims that a JWT must contain to be considered valid is
    #   context-dependent and is outside the scope of this specification.
    #   Specific applications of JWTs will require implementations to
    #   understand and process some claims in particular ways.  However, in
    #   the absence of such requirements, all claims that are not understood
    #   by implementations MUST be ignored.

    it 'should ignore unspecified claims'



    # LIBRARY SPECIFIC BEHAVIORS
    it 'should validate specified claims'
    it 'should assign default claims'




    #   6.  Plaintext JWTs
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-6
    #
    #   To support use cases where the JWT content is secured by a means
    #   other than a signature and/or encryption contained within the JWT
    #   (such as a signature on a data structure containing the JWT), JWTs
    #   MAY also be created without a signature or encryption.  A plaintext
    #   JWT is a JWS using the "none" JWS "alg" Header Parameter Value
    #   defined in JSON Web Algorithms (JWA) [JWA]; it is a JWS with the
    #   empty string for its JWS Signature value.
    #
    #   6.1.  Example Plaintext JWT
    #
    #   The following example JWT Header declares that the encoded object is
    #   a Plaintext JWT:
    #
    #     {"alg":"none"}
    #
    #   Base64url encoding the octets of the UTF-8 representation of the JWT
    #   Header yields this Encoded JWT Header:
    #
    #     eyJhbGciOiJub25lIn0
    #
    #   The following is an example of a JWT Claims Set:
    #
    #     {"iss":"joe",
    #      "exp":1300819380,
    #      "http://example.com/is_root":true}
    #
    #   Base64url encoding the octets of the UTF-8 representation of the JWT
    #   Claims Set yields this encoded JWS Payload (with line breaks for
    #   display purposes only):
    #
    #     eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFt
    #     cGxlLmNvbS9pc19yb290Ijp0cnVlfQ
    #
    #   The encoded JWS Signature is the empty string.
    #
    #   Concatenating these encoded parts in this order with period ('.')
    #   characters between the parts yields this complete JWT (with line
    #   breaks for display purposes only):
    #
    #     eyJhbGciOiJub25lIn0
    #     .
    #     eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFt
    #     cGxlLmNvbS9pc19yb290Ijp0cnVlfQ
    #     .

    describe 'plaintext', ->

      {jwt,token,header,headerJSON,payload,payloadJSON,signature} = {}

      before ->
        header = { alg: 'none' }
        headerJSON = JSON.stringify(header)
        headers = ['alg']
        payload = { iss: 'http://anvil.io' }
        payloadJSON = JSON.stringify(payload)

        MyJWT = JWT.define {header,headers}
        jwt = new MyJWT { iss: 'http://anvil.io' }
        token = jwt.encode()

      it 'should base64url encode the header', ->
        base64url.decode(token.split('.')[0]).should.equal headerJSON

      it 'should base64url encode the payload', ->
        base64url.decode(token.split('.')[1]).should.equal payloadJSON

      it 'should append an empty signature', ->
        token.split('.')[2].should.equal ''




    #   5.1.  Message Signature or MAC Computation
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-5.1
    #
    #   To create a JWS, one MUST perform these steps.  The order of the
    #   steps is not significant in cases where there are no dependencies
    #   between the inputs and outputs of the steps.
    #   1.  Create the content to be used as the JWS Payload.
    #   2.  Compute the encoded payload value BASE64URL(JWS Payload).
    #   3.  Create the JSON object(s) containing the desired set of Header
    #       Parameters, which together comprise the JWS Header: the JWS
    #       Protected Header, and if the JWS JSON Serialization is being
    #       used, the JWS Unprotected Header.
    #   4.  Compute the encoded header value BASE64URL(UTF8(JWS Protected
    #       Header)).  If the JWS Protected Header is not present (which can
    #       only happen when using the JWS JSON Serialization and no
    #       "protected" member is present), let this value be the empty
    #       string.
    #   5.  Compute the JWS Signature in the manner defined for the
    #       particular algorithm being used over the JWS Signing Input
    #       ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' ||
    #       BASE64URL(JWS Payload)).  The "alg" (algorithm) Header Parameter
    #       MUST be present in the JWS Header, with the algorithm value
    #       accurately representing the algorithm used to construct the JWS
    #       Signature.
    #   6.  Compute the encoded signature value BASE64URL(JWS Signature).
    #   7.  These three encoded values are used in both the JWS Compact
    #       Serialization and the JWS JSON Serialization representations.
    #   8.  If the JWS JSON Serialization is being used, repeat this process
    #       (steps 3-7) for each digital signature or MAC operation being
    #       performed.
    #   9.  Create the desired serialized output.  The JWS Compact
    #       Serialization of this result is BASE64URL(UTF8(JWS Protected
    #       Header)) || '.' || BASE64URL(JWS Payload) || '.' || BASE64URL(JWS
    #       Signature).  The JWS JSON Serialization is described in
    #       Section 7.2.


    #   8.  Cryptographic Algorithms
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-8
    #
    #   JWTs use JSON Web Signature (JWS) [JWS] and JSON Web Encryption (JWE)
    #   [JWE] to sign and/or encrypt the contents of the JWT.
    #
    #   Of the signature and MAC algorithms specified in JSON Web Algorithms
    #   (JWA) [JWA], only HMAC SHA-256 ("HS256") and "none" MUST be
    #   implemented by conforming JWT implementations.  It is RECOMMENDED
    #   that implementations also support RSASSA-PKCS1-V1_5 with the SHA-256
    #   hash algorithm ("RS256") and ECDSA using the P-256 curve and the SHA-
    #   256 hash algorithm ("ES256").  Support for other algorithms and key
    #   sizes is OPTIONAL.
    #
    #   [...]

    describe 'with signature', ->

      {MyJWT,header,payload,jwt,token} = {}

      describe 'via HS256', ->

        before ->
          header = { alg: 'HS256' }
          headers = ['alg']
          payload = { iss: 'http://anvil.io' }

          MyJWT = JWT.define {header,headers}
          jwt = new MyJWT payload
          token = jwt.encode('secret')

        it 'should include the base64url encoded header', ->
          token.split('.')[0].should.equal MyJWT.prototype.headerB64u

        it 'should base64url encode the payload', ->
          base64url.decode(token.split('.')[1]).should.equal JSON.stringify(payload)

        it 'should append a HMAC SHA256 signature', ->
          token.split('.')[2].length.should.equal 58




      describe 'via RS256', ->

        before ->
          header = { alg: 'RS256' }
          headers = ['alg']
          payload = { iss: 'http://anvil.io' }
          privateKey = require('fs')
            .readFileSync('test/lib/keys/private.pem')
            .toString('ascii')

          MyJWT = JWT.define {header,headers}
          jwt = new MyJWT payload
          token = jwt.encode(privateKey)

        it 'should include the base64url encoded header', ->
          token.split('.')[0].should.equal MyJWT.prototype.headerB64u

        it 'should base64url encode the payload', ->
          base64url.decode(token.split('.')[1]).should.equal JSON.stringify(payload)

        it 'should append a RSA SHA256 signature', ->
          token.split('.')[2].length.should.equal 456



      describe 'via ES256', ->

        before ->
          header = { alg: 'ES256' }
          headers = ['alg']
          payload = { iss: 'http://anvil.io' }
          privateKey = require('fs')
            .readFileSync('test/lib/keys/private.pem')
            .toString('ascii')

          MyJWT = JWT.define {header,headers}
          jwt = new MyJWT payload
          token = jwt.encode(privateKey)

        it 'should include the base64url encoded header', ->
          token.split('.')[0].should.equal MyJWT.prototype.headerB64u

        it 'should base64url encode the payload', ->
          base64url.decode(token.split('.')[1]).should.equal JSON.stringify(payload)

        it 'should append a ECDSA SHA256 signature', ->
          token.split('.')[2].length.should.equal 456





    #   8.  Cryptographic Algorithms
    #
    #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-8
    #
    #   JWTs use JSON Web Signature (JWS) [JWS] and JSON Web Encryption (JWE)
    #   [JWE] to sign and/or encrypt the contents of the JWT.
    #
    #   [...]
    #
    #   If an implementation provides encryption capabilities, of the
    #   encryption algorithms specified in [JWA], only RSAES-PKCS1-V1_5 with
    #   2048 bit keys ("RSA1_5"), AES Key Wrap with 128 and 256 bit keys
    #   ("A128KW" and "A256KW"), and the composite authenticated encryption
    #   algorithm using AES CBC and HMAC SHA-2 ("A128CBC-HS256" and
    #   "A256CBC-HS512") MUST be implemented by conforming implementations.
    #   It is RECOMMENDED that implementations also support using ECDH-ES to
    #   agree upon a key used to wrap the Content Encryption Key
    #   ("ECDH-ES+A128KW" and "ECDH-ES+A256KW") and AES in Galois/Counter
    #   Mode (GCM) with 128 bit and 256 bit keys ("A128GCM" and "A256GCM").
    #   Support for other algorithms and key sizes is OPTIONAL.

    describe 'with encryption', ->

      describe 'via RSA1_5', ->

      describe 'via A128KW', ->

      describe 'via A256KW', ->

      describe 'via A128CBC-HS256', ->

      describe 'via A256CBC-HS512', ->




    describe 'with signature and encryption (nested)', ->





  #   http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-18#section-7
  #
  #   When validating a JWT, the following steps MUST be taken.  The order
  #   of the steps is not significant in cases where there are no
  #   dependencies between the inputs and outputs of the steps.  If any of
  #   the listed steps fails then the JWT MUST be rejected for processing.
  #
  #   1.   The JWT MUST contain at least one period ('.') character.
  #
  #   2.   Let the Encoded JWT Header be the portion of the JWT before the
  #        first period ('.') character.
  #
  #   3.   The Encoded JWT Header MUST be successfully base64url decoded
  #        following the restriction given in this specification that no
  #        padding characters have been used.
  #
  #   4.   The resulting JWT Header MUST be completely valid JSON syntax
  #        conforming to [RFC7158].
  #
  #   5.   The resulting JWT Header MUST be validated to only include
  #        parameters and values whose syntax and semantics are both
  #        understood and supported or that are specified as being ignored
  #        when not understood.
  #
  #   6.   Determine whether the JWT is a JWS or a JWE using any of the
  #        methods described in Section 9 of [JWE].
  #
  #   7.   Depending upon whether the JWT is a JWS or JWE, there are two
  #        cases:
  #
  #        *  If the JWT is a JWS, all steps specified in [JWS] for
  #           validating a JWS MUST be followed.  Let the Message be the
  #           result of base64url decoding the JWS Payload.
  #
  #        *  Else, if the JWT is a JWE, all steps specified in [JWE] for
  #           validating a JWE MUST be followed.  Let the Message be the
  #           JWE Plaintext.
  #
  #   8.   If the JWT Header contains a "cty" (content type) value of
  #        "JWT", then the Message is a JWT that was the subject of nested
  #        signing or encryption operations.  In this case, return to Step
  #        1, using the Message as the JWT.
  #
  #   9.   Otherwise, let the JWT Claims Set be the Message.
  #
  #   10.  The JWT Claims Set MUST be completely valid JSON syntax
  #        conforming to [RFC7158].

  describe 'decode', ->


    it 'should verify the token is well formed', ->
      JWT.decode('notajot').message.should.equal 'Malformed JWT'





    describe 'with plaintext', ->

      {token,jwt} = {}

      before ->
        token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vYW52aWwuaW8ifQ.'
        jwt = JWT.decode token

      it 'should base64url decode the header', ->
        jwt.header.alg.should.equal 'none'

      it 'should base64url decode the payload', ->
        jwt.payload.iss.should.equal 'http://anvil.io'

      it 'should have an empty signature', ->
        jwt.signature.should.equal ''





    #   5.2.  Message Signature or MAC Validation
    #
    #   http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-23#section-5.2
    #
    #   When validating a JWS, the following steps MUST be taken.  The order
    #   of the steps is not significant in cases where there are no
    #   dependencies between the inputs and outputs of the steps.  If any of
    #   the listed steps fails, then the signature or MAC cannot be
    #   validated.
    #
    #   It is an application decision which signatures, MACs, or plaintext
    #   values must successfully validate for the JWS to be accepted.  In
    #   some cases, all must successfully validate or the JWS will be
    #   rejected.  In other cases, only a specific signature, MAC, or
    #   plaintext value needs to be successfully validated.  However, in all
    #   cases, at least one signature, MAC, or plaintext value MUST
    #   successfully validate or the JWS MUST be rejected.
    #
    #   1.   Parse the JWS representation to extract the serialized values
    #        for the components of the JWS -- when using the JWS Compact
    #        Serialization, the base64url encoded representations of the JWS
    #        Protected Header, the JWS Payload, and the JWS Signature, and
    #        when using the JWS JSON Serialization, also the unencoded JWS
    #        Unprotected Header value.  When using the JWS Compact
    #        Serialization, the JWS Protected Header, the JWS Payload, and
    #        the JWS Signature are represented as base64url encoded values in
    #        that order, separated by two period ('.') characters.  The JWS
    #        JSON Serialization is described in Section 7.2.
    #   2.   The encoded representation of the JWS Protected Header MUST be
    #        successfully base64url decoded following the restriction that no
    #        padding characters have been used.
    #   3.   The resulting octet sequence MUST be a UTF-8 encoded
    #        representation of a completely valid JSON object conforming to
    #        [RFC7158], which is the JWS Protected Header.
    #   4.   If using the JWS Compact Serialization, let the JWS Header be
    #        the JWS Protected Header; otherwise, when using the JWS JSON
    #        Serialization, let the JWS Header be the union of the members of
    #        the corresponding JWS Protected Header and JWS Unprotected
    #        Header, all of which must be completely valid JSON objects.
    #   5.   The resulting JWS Header MUST NOT contain duplicate Header
    #        Parameter names.  When using the JWS JSON Serialization, this
    #        restriction includes that the same Header Parameter name also
    #        MUST NOT occur in distinct JSON object values that together
    #        comprise the JWS Header.
    #   6.   Verify that the implementation understands and can process all
    #        fields that it is required to support, whether required by this
    #        specification, by the algorithm being used, or by the "crit"
    #        Header Parameter value, and that the values of those parameters
    #        are also understood and supported.
    #   7.   The encoded representation of the JWS Payload MUST be
    #        successfully base64url decoded following the restriction that no
    #        padding characters have been used.
    #   8.   The encoded representation of the JWS Signature MUST be
    #        successfully base64url decoded following the restriction that no
    #        padding characters have been used.
    #   9.   The JWS Signature MUST be successfully validated against the JWS
    #        Signing Input ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.'
    #        || BASE64URL(JWS Payload)) in the manner defined for the
    #        algorithm being used, which MUST be accurately represented by
    #        the value of the "alg" (algorithm) Header Parameter, which MUST
    #        be present.
    #   10.  If the JWS JSON Serialization is being used, repeat this process
    #        (steps 4-9) for each digital signature or MAC value contained in
    #        the representation.

    describe 'with signature', ->

      describe 'via HS256', ->

        {token,jwt} = {}

        before ->
          token = 'eyJhbGciOiJIUzI1NiJ9.' +
                  'eyJpc3MiOiJodHRwOi8vYW52aWwuaW8ifQ.' +
                  'UjFRb0dUSmN6RFpxc2VOUXQ5eVhUM1lvT1kxamtURVBBeEZ5SzkzaFktOA'
          MyJWT = JWT.define
            header: { alg: 'HS256' }
            headers: ['alg']
            claims: ['iss']

          jwt = MyJWT.decode token, 'secret'

        it 'should base64url decode the header', ->
          jwt.header.alg.should.equal 'HS256'

        it 'should base64url decode the payload', ->
          jwt.payload.iss.should.equal 'http://anvil.io'

        it 'should have an empty signature', ->
          jwt.signature.should.equal 'R1QoGTJczDZqseNQt9yXT3YoOY1jkTEPAxFyK93hY-8'


      describe 'via RS256', ->

        {token,jwt} = {}

        before ->
          token = 'eyJhbGciOiJSUzI1NiJ9.' +
                  'eyJpc3MiOiJodHRwOi8vYW52aWwuaW8ifQ.' +
                  'UEMyUkdJanZMaHUyU20tZFpncUJtRmd5OEZXU3M0SkZXUVg0ZTN4T2xyN2I3eHhGUzAwQW90V3ZaQ1RlbWV5aWdVdmhpQlhuUUFLcjhtbzR1WElFRWQybkhLMDhZdW4tQnpuOW0yYnVZcWVkRk8wX3h0UDVURzFtTm00akdRM0RRcFpTM0NrVWl6cHZJN21iN3hnb3lERklrZnQ3b2ZFSUxJaGJ4eXNtTTd5RmVTb1VYbkw0TVBXd2prQmtFWVNtTmpiVHJaUzBpRG1rNTI5S3lpa0hJS2RrbExka0R0dENESTdBN0JGNUZiMmZ1QnNYdU54bGtETGRkb2FlRTdzeVJOZDV1czQ1QzB2b2tKSUNxUll1NUsyR1BKOEdudGo4Qk9tZWpiWmVvVDA3RVRvTWhoTkJVc09MamdtQkR5ZmN3MWU4bDE4R1BLcEJ0S0pPOUl3NnBB'
          MyJWT = JWT.define
            header: { alg: 'RS256' }
            headers: ['alg']
            claims: ['iss']

          publicKey = require('fs')
            .readFileSync('./test/lib/keys/public.pem')
            .toString('ascii')

          jwt = MyJWT.decode token, publicKey

        it 'should base64url decode the header', ->
          jwt.header.alg.should.equal 'RS256'

        it 'should base64url decode the payload', ->
          jwt.payload.iss.should.equal 'http://anvil.io'

        it 'should have a signature', ->
          jwt.signature.should.equal 'PC2RGIjvLhu2Sm-dZgqBmFgy8FWSs4JFWQX4e3xOlr7b7xxFS00AotWvZCTemeyigUvhiBXnQAKr8mo4uXIEEd2nHK08Yun-Bzn9m2buYqedFO0_xtP5TG1mNm4jGQ3DQpZS3CkUizpvI7mb7xgoyDFIkft7ofEILIhbxysmM7yFeSoUXnL4MPWwjkBkEYSmNjbTrZS0iDmk529KyikHIKdklLdkDttCDI7A7BF5Fb2fuBsXuNxlkDLddoaeE7syRNd5us45C0vokJICqRYu5K2GPJ8Gntj8BOmejbZeoT07EToMhhNBUsOLjgmBDyfcw1e8l18GPKpBtKJO9Iw6pA'


      describe 'via ES256', ->

        {jwt,token} = {}


        before ->
          token = 'eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYW52aWwuaW8ifQ.SHJ6eXY3eUNXbm1EV0Z2RHJmMmZSVktKSW9ZbVB4a1hpb0ZOUS1NVmxhSE1aTFFiYzZsR2tQTV9pRTlnTHc5NU55c3d1MlZnd3hxUm9hdDRDWGl6MlV6RU9wMUxaU2FSRTRBQy1WSWVNT3gwRi1iQi1wOFAtYVYzRTkwb24xcU1OUld1SjlKLUk2RmF4c1Q0ZE8zRm44Zi0wZ0JrMEtMTTZCZW9YXzNoRXRVX2tqWHdhN1pkZ0dBUGdsWEpIWXFnNFhLbm9tUVNycFVBT0NsUFpDbE5aWndKbG9DcERVU05OcnRhY2p1U09FVlFvMXZXV0hNWE5TMzhWeUQtVzFkSXZSVGJMTWhUd0wxUndhZTJnQ2pCWUIxZ3IzeFpzcU0tTXZQWGxYMkJ1ZHR5WXgtbmNEU2tMS3lMRXVDdDJ1WGNhMlVqZndmY0NYbXNPZUQ2MElzTHZn'
          MyJWT = JWT.define
            header: { alg: 'ES256' }
            headers: ['alg']
            claims: ['iss']

          publicKey = require('fs')
            .readFileSync('./test/lib/keys/public.pem')
            .toString('ascii')

          jwt = MyJWT.decode token, publicKey

        it 'should base64url decode the header', ->
          jwt.header.alg.should.equal 'ES256'

        it 'should base64url decode the payload', ->
          jwt.payload.iss.should.equal 'http://anvil.io'

        it 'should have a signature', ->
          jwt.signature.should.equal 'Hrzyv7yCWnmDWFvDrf2fRVKJIoYmPxkXioFNQ-MVlaHMZLQbc6lGkPM_iE9gLw95Nyswu2VgwxqRoat4CXiz2UzEOp1LZSaRE4AC-VIeMOx0F-bB-p8P-aV3E90on1qMNRWuJ9J-I6FaxsT4dO3Fn8f-0gBk0KLM6BeoX_3hEtU_kjXwa7ZdgGAPglXJHYqg4XKnomQSrpUAOClPZClNZZwJloCpDUSNNrtacjuSOEVQo1vWWHMXNS38VyD-W1dIvRTbLMhTwL1Rwae2gCjBYB1gr3xZsqM-MvPXlX2BudtyYx-ncDSkLKyLEuCt2uXca2UjfwfcCXmsOeD60IsLvg'


    describe 'with encryption', ->





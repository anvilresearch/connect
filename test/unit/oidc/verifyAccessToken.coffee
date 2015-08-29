chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




settings            = require '../../../boot/settings'
AccessToken         = require '../../../models/AccessToken'
{verifyAccessToken} = require '../../../oidc'




describe 'Verify Access Token', ->


  {req,res,next,err,token} = {}


  describe 'with token missing', ->

    beforeEach (done) ->
      req  = {}
      res  = {}
      next = sinon.spy()

      options =
        iss:    settings.issuer
        key:    settings.keys.sig.pub
        scope: 'profile'

      verifyAccessToken(options) req, res, (error) ->
        err = error
        done()

    it 'should provide an UnauthorizedError', ->
      err.name.should.equal 'UnauthorizedError'

    it 'should provide a realm', ->
      err.realm.should.equal 'user'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_request'

    it 'should provide an error description', ->
      err.error_description.should.equal 'An access token is required'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with invalid token', ->

    before (done) ->
      req  = { bearer: 'invalid.jwt' }
      res  = {}
      next = sinon.spy()

      options =
        iss:    settings.issuer
        key:    settings.keys.sig.pub
        scope: 'profile'

      verifyAccessToken(options) req, res, (error) ->
        err = error
        done()

    it 'should provide an UnauthorizedError', ->
      err.name.should.equal 'UnauthorizedError'

    it 'should provide a realm', ->
      err.realm.should.equal 'user'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_token'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Invalid access token'

    it 'should provide a status code', ->
      err.statusCode.should.equal 401




  describe 'with token missing but not required', ->

    before (done) ->
      token =
        at:       'r4nd0m'
        iss:       settings.issuer
        uid:      'uuid1'
        cid:      'uuid2'
        scope:    'openid profile'
        created:   Date.now()
        ei:        1000

      sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

      req  = {}
      res  = {}
      next = sinon.spy (error) ->
        err = error
        done()

      options =
        iss:      settings.issuer
        key:      settings.keys.sig.pub
        scope:   'profile'
        required: false

      verifyAccessToken(options) req, res, next

    after ->
      AccessToken.get.restore()

    it 'should reference the claims on the request', ->
      req.claims.should.eql {}

    it 'should continue', ->
      next.should.have.been.called




  describe 'with valid token', ->

    before (done) ->
      token =
        at:       'r4nd0m'
        iss:      settings.issuer
        uid:      'uuid1'
        cid:      'uuid2'
        scope:    'openid profile'
        created: Date.now()
        ei: 1000

      sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

      req  = { bearer: 'valid' }
      res  = {}
      next = sinon.spy (error) ->
        err = error
        done()

      options =
        iss:    settings.issuer
        key:    settings.keys.sig.pub
        scope: 'profile'

      verifyAccessToken(options) req, res, next

    after ->
      AccessToken.get.restore()

    it 'should reference the claims on the request', ->
      req.claims.jti.should.equal token.at

    it 'should continue', ->
      next.should.have.been.called






chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




AuthorizationCode = require '../../models/AuthorizationCode'
{verifyAuthorizationCode} = require '../../lib/oidc'

{nowSeconds} = require '../../lib/time-utils'



describe 'Verify Authorization Code', ->


  {req,res,next,err} = {}


  describe 'with unknown authorization code', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, null)

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'UNKNOWN'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should provide an AuthorizationError', ->
      err.name.should.equal 'AuthorizationError'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_grant'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Authorization not found'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with previously used authorization code', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, {
        used: true
      })

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'USED'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should provide an AuthorizationError', ->
      err.name.should.equal 'AuthorizationError'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_grant'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Authorization code invalid'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with expired authorization code', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, {
        expires_at: nowSeconds(-1)
      })

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'USED'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should provide an AuthorizationError', ->
      err.name.should.equal 'AuthorizationError'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_grant'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Authorization code expired'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with mismatching redirect uri', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, {
        expires_at: nowSeconds(1)
        redirect_uri: 'https://wrong.url/cb'
      })

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'VALID'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should provide an AuthorizationError', ->
      err.name.should.equal 'AuthorizationError'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_grant'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Mismatching redirect uri'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with mismatching client id', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, {
        expires_at: nowSeconds(1)
        redirect_uri: 'https://some.client.com/cb'
        client_id: 'id'
      })

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'VALID'
        client:
          _id: 'MISMATCHING'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should provide an AuthorizationError', ->
      err.name.should.equal 'AuthorizationError'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_grant'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Mismatching client id'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'with valid request', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'getByCode').callsArgWith(1, null, {
        expires_at: nowSeconds(1)
        redirect_uri: 'https://some.client.com/cb'
        client_id: 'id'
      })

      req =
        connectParams:
          grant_type: 'authorization_code'
          redirect_uri: 'https://some.client.com/cb'
          code: 'VALID'
        client:
          _id: 'id'
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyAuthorizationCode(req, res, next)

    after ->
      AuthorizationCode.getByCode.restore()

    it 'should not provide an error', ->
      expect(err).to.be.null

    it 'should continue', ->
      next.should.have.been.called





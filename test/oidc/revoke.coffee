nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



User     = require '../../models/User'
{revoke} = require '../../oidc'




describe 'Revoke third party access token', ->


  {req,res,next,err} = {}


  describe 'with unknown provider', ->

    before ->
      req =
        params:
          provider: 'unknown'
      res = {}
      next = sinon.spy()

      revoke req, res, next

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        message: 'invalid_request'
        description: 'Unknown provider'
      })





  describe 'with undefined revoke endpoint', ->

    before ->
      req =
        params:
          provider: 'oauth2test'
      res = {}
      next = sinon.spy()

      revoke req, res, next

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        message: 'invalid_request'
        description: 'Undefined revoke endpoint'
      })




  describe 'with unknown user', ->

    before ->
      sinon.stub(User, 'get').callsArgWith(1, null, null)
      req =
        claims:
          sub: 'unknown'
        params:
          provider: 'google'
      res = {}
      next = sinon.spy()

      revoke req, res, next

    after ->
      User.get.restore()

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        message: 'invalid_request'
        description: 'Unknown user'
      })




  describe 'with no provider for this user', ->

    before ->
      sinon.stub(User, 'get').callsArgWith(1, null, { providers: {} })
      req =
        claims:
          sub: 'uuid'
        params:
          provider: 'google'
      res = {}
      next = sinon.spy()

      revoke req, res, next

    after ->
      User.get.restore()

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        message: 'invalid_request'
        description: 'No provider for this user'
      })




  describe 'with error response from provider', ->

    before ->
      sinon.stub(User, 'get').callsArgWith(1, null, {
        providers:
          google:
            auth:
              access_token: 't0k3n'
      })
      req =
        claims:
          sub: 'uuid'
        params:
          provider: 'google'
      res =
        json: sinon.spy()
      next = sinon.spy()

      scope = nock('https://accounts.google.com')
                .get('/o/oauth2/revoke')
                .reply(400, 'meh')

      revoke req, res, next

    after ->
      User.get.restore()


    it 'should not provide an error', ->
      next.should.not.have.been.called

    it 'should respond ...'



  describe 'with ok response from provider', ->

    before ->
      sinon.stub(User, 'get').callsArgWith(1, null, {
        providers:
          google:
            auth:
              access_token: 't0k3n'
      })
      req =
        claims:
          sub: 'uuid'
        params:
          provider: 'google'
      res =
        json: sinon.spy()
      next = sinon.spy()

      scope = nock('https://accounts.google.com')
                .get('/o/oauth2/revoke')
                .reply(200, 'meh')

      revoke req, res, next

    after ->
      User.get.restore()

    it 'should not provide an error', ->
      next.should.not.have.been.called

    it 'should respond ...'



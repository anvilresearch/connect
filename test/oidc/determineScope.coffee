chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



server = require '../../server'
User  = require '../../models/User'
Scope = require '../../models/Scope'
{determineScope} = require '../../lib/oidc'




describe 'Determine Scope', ->


  {req,res,next,err} = {}
  {scopes} = {}


  describe 'with unknown scope', ->

    before (done) ->
      scopes = [new Scope({ name: 'openid' }), null, null]
      userScope = ['openid', 'profile', 'developer']
      sinon.stub(Scope, 'get').callsArgWith(1, null, scopes)
      sinon.stub(User.prototype, 'authorizedScope').callsArgWith(0, null, userScope)

      req =
        connectParams: { scope: 'foo bar' }
        user: new User
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      determineScope req, res, next

    after ->
      Scope.get.restore()
      User.prototype.authorizedScope.restore()

    it 'should provide known scope', ->
      req.scopes.should.contain scopes[0]

    it 'should ignore unknown scope', ->
      req.scopes.should.not.contain null

    it 'should not provide an error', ->
      expect(err).to.be.undefined

    it 'should continue', ->
      next.should.have.been.called




  describe 'with scope unregistered for the client', ->

    it 'should provide an AuthorizationError'
    it 'should provide an error'
    it 'should provide an error description'
    it 'should provide a status code'




  describe 'with scope unauthorized for the user', ->

    before (done) ->
      scopes = [
        new Scope({ name: 'openid' }),
        new Scope({ name: 'realm' }),
        null
      ]
      userScope = ['openid', 'profile', 'developer']
      sinon.stub(Scope, 'get').callsArgWith(1, null, scopes)
      sinon.stub(User.prototype, 'authorizedScope').callsArgWith(0, null, userScope)

      req =
        connectParams: { scope: 'openid realm' }
        user: new User
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      determineScope req, res, next

    after ->
      Scope.get.restore()
      User.prototype.authorizedScope.restore()

    it 'should provide authorized scope', ->
      req.scopes.should.contain scopes[0]

    it 'should ignore unauthorized scope', ->
      req.scopes.should.not.contain scopes[1]

    it 'should not provide an error', ->
      expect(err).to.be.undefined

    it 'should continue', ->
      next.should.have.been.called





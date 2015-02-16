chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



server  = require '../../server'
Client  = require '../../models/Client'
Scope   = require '../../models/Scope'
{determineClientScope} = require '../../lib/oidc'




describe 'Determine Client Scope', ->


  {req,res,next,err} = {}
  {scope,scopes} = {}


  describe 'with "client_credentials" grant type', ->

    before (done) ->
      scope  = 'a b c'
      scopes = [
        new Scope name: 'a'
        new Scope name: 'b'
        new Scope name: 'c'
      ]
      sinon.stub(Scope, 'determine').callsArgWith(2, null, scope, scopes)

      req =
        connectParams:
          grant_type: 'client_credentials'
          scope:      'a b c'
        client: new Client
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      determineClientScope req, res, next

    after ->
      Scope.determine.restore()


    it 'should set scope on the request', ->
      req.scope.should.equal scope

    it 'should set scopes on the request', ->
      req.scopes.should.equal scopes

    it 'should not provide an error', ->
      expect(err).to.be.undefined

    it 'should continue', ->
      next.should.have.been.called




  describe 'with other grant type', ->

    before (done) ->
      sinon.stub(Scope, 'determine').callsArgWith(2, null, scope, scopes)

      req =
        connectParams:
          scope:      'a b c'
        client: new Client
      res = {}
      next = sinon.spy (error) ->
        err = error
        done()

      determineClientScope req, res, next

    after ->
      Scope.determine.restore()


    it 'should not determine scope', ->
      Scope.determine.should.not.have.been.called

    it 'should not provide an error', ->
      expect(err).to.be.undefined

    it 'should continue', ->
      next.should.have.been.called





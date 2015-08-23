chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



User    = require '../../../models/User'
Scope   = require '../../../models/Scope'
{determineUserScope} = require '../../../oidc'




describe 'Determine User Scope', ->

  {req,res,next,err} = {}
  {scope,scopes} = {}

  before (done) ->
    scope  = 'openid profile developer'
    scopes = [
      new Scope name: 'openid'
      new Scope name: 'profile'
      new Scope name: 'developer'
    ]
    sinon.stub(Scope, 'determine').callsArgWith(2, null, scope, scopes)

    req =
      connectParams: { scope: 'a b c' }
      user: new User
    res = {}
    next = sinon.spy (error) ->
      err = error
      done()

    determineUserScope req, res, next

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





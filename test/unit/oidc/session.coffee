chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{session} = require '../../../oidc'




describe 'Session', ->


  {req,res} = {}


  before ->
    req =
      session:
        opbs: '0pb5'
    res =
      cookie: sinon.spy()
      set:    sinon.spy()
      render: sinon.spy()
    session(req, res)

  it 'should set the browser state cookie', ->
    res.cookie.should.have.been.calledWith 'anvil.connect.op.state', '0pb5'

  it 'should set the Cache-Control header', ->
    res.set.should.have.been.calledWith sinon.match({ 'Cache-Control': 'no-store' })

  it 'should set the Pragma header', ->
    res.set.should.have.been.calledWith sinon.match({ 'Pragma': 'no-cache' })

  it 'should render the session view', ->
    res.render.should.have.been.calledWith 'session'


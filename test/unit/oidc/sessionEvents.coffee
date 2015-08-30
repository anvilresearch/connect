chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




oidc          = require '../../../oidc'
sessionEvents = oidc.sessionEvents




describe 'Session Events', ->


  {req,res} = {}


  before ->
    req =
      socket:
        setTimeout: sinon.spy()
      session:
        opbs:     '0pb5'
    res =
      writeHead:  sinon.spy()
      write:      sinon.spy()
    sessionEvents(req, res)

  it 'should set the socket timeout', ->
    req.socket.setTimeout.should.have.been.calledWith 0

  it 'should respond 200', ->

  it 'should respond with text/event-stream Content-Type', ->
    res.writeHead.should.have.been.calledWith 200, sinon.match({
      'Content-Type': 'text/event-stream'
    })

  it 'should respond with no-cache Cache-Control', ->
    res.writeHead.should.have.been.calledWith 200, sinon.match({
      'Cache-Control': 'no-cache'
    })

  it 'should respond with keep-alive Connection', ->
    res.writeHead.should.have.been.calledWith 200, sinon.match({
      'Connection': 'keep-alive'
    })

  it 'should write retry value to the response', ->
    res.write.should.have.been.calledWith sinon.match('retry:')

  #it 'should check the session', ->
  #  oidc.checkSession.should.have.been.calledWith req, res


chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{selectConnectParams} = require '../../../oidc'




describe 'Select Connect Params', ->


  {req,res,next} = {}


  describe 'with GET request', ->

    before ->
      req = { method: 'GET', query: { param: 'value' } }
      res = {}
      next = sinon.spy()
      selectConnectParams req, res, next

    it 'should reference the parsed querystring object', ->
      req.connectParams.param.should.equal 'value'

    it 'should continue', ->
      next.should.have.been.called




  describe 'with POST request', ->

    before ->
      req = { method: 'POST', body: { param: 'value' } }
      res = {}
      next = sinon.spy()
      selectConnectParams req, res, next

    it 'should reference the parsed request body object', ->
      req.connectParams.param.should.equal 'value'

    it 'should continue', ->
      next.should.have.been.called



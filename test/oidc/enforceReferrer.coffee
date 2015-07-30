chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{enforceReferrer} = require '../../oidc'

InvalidRequestError = require '../../errors/InvalidRequestError'

settings = require '../../boot/settings'




describe 'Enforce Referrer', ->


  {req,res,next,issuer} = {}

  pathname = [ '/signin', '/signup' ]

  before ->
    issuer = settings.issuer
    settings.issuer = 'https://connect.example.com'
    enforceReferrer = enforceReferrer pathname
    

  after ->
    settings.issuer = issuer


  describe 'with valid referrer', ->

    before ->
      referrer = 'https://connect.example.com/signin?client_id=1a2b3c4d5e6f7089'

      req =
        get: (name) ->
          if name == 'referrer'
            return referrer
          else
            return undefined
      res = {}
      next = sinon.spy()
      enforceReferrer req, res, next

    it 'should continue', ->
      next.should.have.been.called

    it 'should not provide an error', ->
      next.should.not.have.been.calledWith sinon.match.defined




  describe 'with invalid referrer', ->

    before ->
      referrer = 'http://viruses.r.us/phishing_for_n00bs'

      req =
        get: (name) ->
          if name == 'referrer'
            return referrer
          else
            return undefined
      res = {}
      next = sinon.spy()
      enforceReferrer req, res, next

    it 'should continue', ->
      next.should.have.been.called

    it 'should provide an InvalidRequestError', ->
      next.should.have.been.calledWith(
        sinon.match.instanceOf(InvalidRequestError)
      )






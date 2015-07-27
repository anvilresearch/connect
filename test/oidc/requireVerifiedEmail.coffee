chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{requireVerifiedEmail} = require '../../oidc'




describe 'Require verified email', ->

  {req,res,next} = {}

  describe 'with email already verified', ->

    before ->
      req =
        user:
          emailVerified: true
        provider:
          emailVerification:
            enable: true
            require: true

      res = { render: sinon.spy() }
      next = sinon.spy()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    it 'should not prompt the user for verification', ->
      res.render.should.not.have.been.called

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unverified email and verification required', ->

    before ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: true

      res = { render: sinon.spy() }
      next = sinon.spy()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    it 'should prompt the user for verification', ->
      res.render.should.have.been.called

    it 'should not continue', ->
      next.should.not.have.been.called

    it 'should render the \'requireVerifiedEmail\' view by default', ->
      res.render.should.have.been.calledWith 'requireVerifiedEmail'

    it 'should pass resendURL to the view engine by default', ->
      res.render.should.have.been.calledWith(
        sinon.match.string,
        sinon.match({
          resendURL: sinon.match.string
        })
      )




  describe 'with unverified email, verification required, and custom view', ->

    before ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: true

      res = { render: sinon.spy() }
      next = sinon.spy()

      options =
        view: 'testView'
        locals:
          resendURL: 'value'
        force: true

      requireVerifiedEmail(options) req, res, next

    it 'should prompt the user for verification', ->
      res.render.should.have.been.called

    it 'should not continue', ->
      next.should.not.have.been.called

    it 'should render the view provided in options.view', ->
      res.render.should.have.been.calledWith 'testView'

    it 'should pass options.locals to the view engine', ->
      res.render.should.have.been.calledWith(
        sinon.match.string,
        sinon.match({ resendURL: 'value' })
      )

  describe 'with unverified email and email verification disabled', ->

    before ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: false
            require: true

      res = { render: sinon.spy() }
      next = sinon.spy()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    it 'should not prompt the user for verification', ->
      res.render.should.not.have.been.called

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unverified email, verification enabled, forced, not required', ->

    before ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: false

      res = { render: sinon.spy() }
      next = sinon.spy()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    it 'should prompt the user for verification', ->
      res.render.should.have.been.called

    it 'should not continue', ->
      next.should.not.have.been.called






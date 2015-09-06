chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{requireVerifiedEmail} = require '../../../oidc'
Role = require '../../../models/Role'




describe 'Require verified email', ->

  {req,res,next} = {}

  describe 'with email already verified', ->

    before (done) ->
      req =
        user:
          emailVerified: true
        provider:
          emailVerification:
            enable: true
            require: true
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, []

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

    it 'should not prompt the user for verification', ->
      res.render.should.not.have.been.called

    it 'should continue', ->
      next.should.have.been.called




  describe 'with authority user', ->

    before (done) ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: true
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, [{
        name: 'authority'
      }]

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

    it 'should not prompt the user for verification', ->
      res.render.should.not.have.been.called

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unverified email and verification required', ->

    before (done) ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: true
        flash: sinon.spy (key) -> [true]
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, []

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

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

    before (done) ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: true
        flash: sinon.spy (key) -> [true]
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, []

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        view: 'testView'
        locals:
          resendURL: 'value'
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

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

    before (done) ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: false
            require: true
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, []

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

    it 'should not prompt the user for verification', ->
      res.render.should.not.have.been.called

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unverified email, verification enabled, forced, not required', ->

    before (done) ->
      req =
        user:
          emailVerified: false
        provider:
          emailVerification:
            enable: true
            require: false
        flash: sinon.spy (key) -> [true]
      sinon.stub(Role, 'listByUsers').callsArgWith 1, null, []

      res =
        render: sinon.spy ->
          done()

      next = sinon.spy ->
        done()

      options =
        force: true

      requireVerifiedEmail(options) req, res, next

    after ->
      Role.listByUsers.restore()

    it 'should prompt the user for verification', ->
      res.render.should.have.been.called

    it 'should not continue', ->
      next.should.not.have.been.called






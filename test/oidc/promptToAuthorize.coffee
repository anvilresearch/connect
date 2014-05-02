chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{promptToAuthorize} = require '../../lib/oidc'




describe 'Prompt to Authorize', ->


  {req,res,next,err} = {}


  describe 'with third party client', ->

    describe 'at authorize endpoint', ->

      before ->
        req =
          connectParams: {}
          client: {}
          user:   {}
          scopes: {}
          path:   '/authorize'

        res =
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        promptToAuthorize req, res, next

      it 'should render the consent view', ->
        res.render.should.have.been.calledWith 'authorize',
          request: req.connectParams
          client:  req.client
          user:    req.user
          scopes:  req.scopes

      it 'should not redirect', ->
        res.redirect.should.not.have.been.called

      it 'should not continue', ->
        next.should.not.have.been.called


    describe 'at other endpoint', ->

      before ->
        req =
          connectParams: {}
          client: {}
          user:   {}
          scopes: {}
          path:   '/signin'

        res =
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        promptToAuthorize req, res

      it 'should not render the consent view', ->
        res.render.should.not.have.been.called

      it 'should redirect to the authorize endpoint', ->
        res.redirect.should.have.been.calledWith '/authorize?'

      it 'should not continue', ->
        next.should.not.have.been.called


  describe 'with third party client and "authorize" parameter', ->

    describe 'at authorize endpoint', ->

      before ->
        req =
          connectParams: { authorize: true }
          client: {}
          user:   {}
          scopes: {}
          path:   '/authorize'

        res =
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        promptToAuthorize req, res, next

      it 'should not render the consent view', ->
        res.render.should.not.have.been.called

      it 'should not redirect', ->
        res.redirect.should.not.have.been.called

      it 'should continue', ->
        next.should.have.been.called



    describe 'at other endpoint', ->

      # should a client be able to post consent to endpoints other
      # than /authorize? Seems fishy... we could:
      # 1. redirect
      # 2. give and error
      # 3. bury our heads in the sand
      # 4. cry
      # 5. ...
      # 6. profit
      it 'WTF should we do here?'



  describe 'with trusted client', ->

      before ->
        req =
          connectParams: {}
          client: { trusted: true }
          user:   {}
          scopes: {}
          path:   '/authorize'

        res =
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        promptToAuthorize req, res, next

      it 'should add the "authorize" parameter', ->
        req.connectParams.authorize.should.equal 'true'

      it 'should not render the consent view', ->
        res.render.should.not.have.been.called

      it 'should not redirect', ->
        res.redirect.should.not.have.been.called

      it 'should continue', ->
        next.should.have.been.called

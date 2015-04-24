chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



settings = require '../../boot/settings'
Client = require '../../models/Client'
IDToken = require '../../models/IDToken'
{signout} = require('../../oidc')



describe 'Signout', ->


  {opbs,req,res,next} = {}


  describe 'with uri and hint,', ->


    describe 'valid token', ->




      validIDToken = new IDToken({
        iss: 'https://anvil.io',
        sub: 'user-uuid',
        aud: 'client-uuid',

      }).encode(settings.privateKey)




      describe 'and client get error', ->

        before (done) ->
          sinon.stub(Client, 'get').callsArgWith(1, new Error())
          opbs = 'b3f0r3'
          req =
            query:
              post_logout_redirect_uri: 'http://example.com'
              id_token_hint: validIDToken
            session:
              opbs: opbs
            logout: sinon.spy()
          res =
            set: sinon.spy()
            send: sinon.spy()
            redirect: sinon.spy()
          next = sinon.spy (error) ->
            err = error
            done()

          signout(req, res, next)

        after ->
          Client.get.restore()

        it 'should provide an error', ->
          next.should.have.been.calledWith new Error()


      describe 'and unknown client', ->

        before (done) ->
          opbs = 'b3f0r3'
          req =
            query:
              post_logout_redirect_uri: 'http://example.com'
              id_token_hint: validIDToken
            session:
              opbs: opbs
            logout: sinon.spy()
          res =
            set: sinon.spy()
            send: sinon.spy()
            redirect: sinon.spy()
          next = sinon.spy (error) ->
            err = error
            done()

          signout(req, res, next)

        it 'should not update OP browser state', ->
          req.session.opbs.should.equal opbs

        it 'should provide an error', ->
          next.should.have.been.called

        it 'should not redirect', ->
          res.redirect.should.not.have.been.called

        it 'should not respond', ->
          res.send.should.not.have.been.called


      describe 'with unknown uri', ->

        it 'should logout'
        it 'should update OP browser state'
        it 'should respond 204'


      describe 'with valid client', ->

        it 'should logout'
        it 'should update OP browser state'
        it 'should redirect'


    describe 'with invalid token', ->

      it 'should provide an InvalidTokenError'




  describe 'with uri only', ->

    before ->
      opbs = 'b3f0r3'
      req =
        query:
          post_logout_redirect_uri: 'https://example.com'
        session:
          opbs: opbs
        logout: sinon.spy()
      res =
        redirect: sinon.spy()
      next = sinon.spy()
      signout(req, res, next)

    it 'should logout', ->
      req.logout.should.have.been.called

    it 'should update OP browser state', ->
      req.session.opbs.should.not.equal opbs

    it 'should redirect', ->
      res.redirect.should.have.been.calledWith req.query.post_logout_redirect_uri




  describe 'without uri', ->

    before ->
      opbs = 'b3f0r3'
      req =
        query: {}
        session:
          opbs: opbs
        logout: sinon.spy()
      res =
        set: sinon.spy()
        send: sinon.spy()
      next = sinon.spy()
      signout(req, res, next)

    it 'should logout', ->
      req.logout.should.have.been.called

    it 'should update OP browser state', ->
      req.session.opbs.should.not.equal opbs

    it 'should respond 204', ->
      res.send.should.have.been.calledWith 204

    it 'should respond with Cache-Control header', ->
      res.set.should.have.been.calledWith sinon.match({
        'Cache-Control': 'no-store'
      })

    it 'should respond with Pragma header', ->
      res.set.should.have.been.calledWith sinon.match({
        'Pragma': 'no-cache'
      })





chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



settings = require '../../../boot/settings'
authenticator = require '../../../lib/authenticator'
Client = require '../../../models/Client'
IDToken = require '../../../models/IDToken'
InvalidTokenError = require '../../../errors/InvalidTokenError'
{signout} = require('../../../oidc')


describe 'Signout', ->


  {opbs,req,res,next} = {}


  describe 'with uri and hint,', ->


    describe 'valid token', ->


      validIDToken = new IDToken({
        iss: 'https://anvil.io',
        sub: 'user-uuid',
        aud: 'client-uuid',

      }).encode(settings.keys.sig.prv)


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
          res =
            set: sinon.spy()
            send: sinon.spy()
            redirect: sinon.spy()
            sendStatus: sinon.spy()
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
          sinon.stub(Client, 'get').callsArgWith 1, null, null
          opbs = 'b3f0r3'
          req =
            query:
              post_logout_redirect_uri: 'http://example.com'
              id_token_hint: validIDToken
            session:
              opbs: opbs
          res =
            set: sinon.spy()
            sendStatus: sinon.spy (status) ->
              done()
            redirect: sinon.spy()
          next = sinon.spy()
          signout(req, res, next)

        after ->
          Client.get.restore()

        it 'should update OP browser state', ->
          req.session.opbs.should.not.equal opbs

        it 'should not continue', ->
          next.should.not.have.been.called

        it 'should not redirect', ->
          res.redirect.should.not.have.been.called

        it 'should respond', ->
          res.sendStatus.should.have.been.called


      describe 'and unknown uri', ->

        before ->
          sinon.spy authenticator, 'logout'
          client = new Client
            post_logout_redirect_uris: []
          sinon.stub(Client, 'get').callsArgWith(1, null, client)
          opbs = 'b3f0r3'
          req =
            query:
              post_logout_redirect_uri: 'http://wrong.com'
              id_token_hint: validIDToken
            session:
              opbs: opbs
              amr: ['pwd']
          res =
            set: sinon.spy()
            sendStatus: sinon.spy()
            redirect: sinon.spy()
          next = sinon.spy()
          signout(req, res, next)

        after ->
          authenticator.logout.restore()
          Client.get.restore()

        it 'should logout', ->
          authenticator.logout.should.have.been.called

        it 'should update OP browser state', ->
          req.session.opbs.should.not.equal opbs

        it 'should delete amr from session', ->
          expect(req.session.amr).to.be.undefined

        it 'should respond 204', ->
          res.sendStatus.should.have.been.calledWith 204

      describe 'and valid uri', ->

        before ->
          sinon.spy authenticator, 'logout'
          client = new Client
            post_logout_redirect_uris: ['http://example.com']
          sinon.stub(Client, 'get').callsArgWith(1, null, client)
          opbs = 'b3f0r3'
          req =
            query:
              post_logout_redirect_uri: 'http://example.com'
              id_token_hint: validIDToken
              state: 'encodedState'
            session:
              opbs: opbs
              amr: ['otp']
          res =
            set: sinon.spy()
            send: sinon.spy()
            redirect: sinon.spy()
            sendStatus: sinon.spy()
          next = sinon.spy()
          signout(req, res, next)

        after ->
          authenticator.logout.restore()
          Client.get.restore()

        it 'should logout', ->
          authenticator.logout.should.have.been.called

        it 'should update OP browser state', ->
          req.session.opbs.should.not.equal opbs

        it 'should delete amr from session', ->
          expect(req.session.amr).to.be.undefined

        it 'should not respond 204', ->
          res.send.should.not.have.been.calledWith 204

        it 'should redirect with state param', ->
          res.redirect.should.have.been.calledWith 303, req.query.post_logout_redirect_uri + '?state='+req.query.state


    describe 'with invalid token', ->

      invalidIDToken = 'WRONG'

      before (done) ->
        opbs = 'b3f0r3'
        req =
          query:
            post_logout_redirect_uri: 'http://example.com'
            id_token_hint: invalidIDToken
          session:
            opbs: opbs
        res =
          set: sinon.spy()
          sendStatus: sinon.spy (status) ->
            done()
          redirect: sinon.spy()
        next = sinon.spy (err) ->
          done()
        signout(req, res, next)

      it 'should not update OP browser state', ->
        req.session.opbs.should.equal opbs

      it 'should not redirect', ->
        res.redirect.should.not.have.been.called

      it 'should provide an error', ->
        next.should.have.been.calledWith new Error()

      it 'should respond', ->
        res.sendStatus.should.not.have.been.called


  describe 'with uri only', ->

    before ->
      sinon.spy authenticator, 'logout'
      opbs = 'b3f0r3'
      req =
        query:
          post_logout_redirect_uri: 'https://example.com'
        session:
          opbs: opbs
          amr: ['sms', 'otp']
      res =
        redirect: sinon.spy()
        set: sinon.spy()
        sendStatus: sinon.spy()
      next = sinon.spy()
      signout(req, res, next)

    after ->
      authenticator.logout.restore()

    it 'should logout', ->
      authenticator.logout.should.have.been.called

    it 'should update OP browser state', ->
      req.session.opbs.should.not.equal opbs

    it 'should delete amr from session', ->
      expect(req.session.amr).to.be.undefined

    it 'should not redirect', ->
      res.redirect.should.not.have.been.called


  describe 'without uri', ->

    before ->
      sinon.spy authenticator, 'logout'
      opbs = 'b3f0r3'
      req =
        query: {}
        session:
          opbs: opbs
          amr: ['pwd']
      res =
        set: sinon.spy()
        sendStatus: sinon.spy()
      next = sinon.spy()
      signout(req, res, next)

    after ->
      authenticator.logout.restore()

    it 'should logout', ->
      authenticator.logout.should.have.been.called

    it 'should update OP browser state', ->
      req.session.opbs.should.not.equal opbs

    it 'should delete amr from session', ->
      expect(req.session.amr).to.be.undefined

    it 'should respond 204', ->
      res.sendStatus.should.have.been.calledWith 204

    it 'should respond with Cache-Control header', ->
      res.set.should.have.been.calledWith sinon.match({
        'Cache-Control': 'no-store'
      })

    it 'should respond with Pragma header', ->
      res.set.should.have.been.calledWith sinon.match({
        'Pragma': 'no-cache'
      })





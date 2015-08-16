chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{verifyEmail} = require '../../oidc'
OneTimeToken  = require '../../models/OneTimeToken'
User          = require '../../models/User'




describe 'Verify Email', ->

  {req,res,next} = {}

  describe 'with missing token', ->

    before ->
      req = query: {}
      res = render: sinon.spy()
      next = sinon.spy()

      verifyEmail req, res, next

    it 'should render an error', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          error: sinon.match.string
        })


  describe 'with invalid or expired token', ->

    before ->
      req =
        query:
          token: 'invalid'
      res = render: sinon.spy()
      next = sinon.spy()

      sinon.stub(OneTimeToken, 'consume').callsArgWith(1, null, null)

      verifyEmail req, res, next

    after ->
      OneTimeToken.consume.restore()

    it 'should render an error', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          error: sinon.match.string
        })


  describe 'with wrong token type', ->

    before ->
      token = new OneTimeToken
        _id: 'misused'
        ttl: 3600
        use: 'wrong'
        sub: 'nomatter'

      req =
        query:
          token: 'misused'
      res = render: sinon.spy()
      next = sinon.spy()

      sinon.stub(OneTimeToken, 'consume').callsArgWith(1, null, token)

      verifyEmail req, res, next

    after ->
      OneTimeToken.consume.restore()

    it 'should render an error', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          error: sinon.match.string
        })


  describe 'with unknown user', ->

    before ->
      token = new OneTimeToken
        _id: 'misused'
        ttl: 3600
        use: 'emailVerification'
        sub: 'unknown'

      req =
        query:
          token: 'valid'
      res = render: sinon.spy()
      next = sinon.spy()

      sinon.stub(OneTimeToken, 'consume').callsArgWith(1, null, token)
      sinon.stub(User, 'patch').callsArgWith(2, null, null)

      verifyEmail req, res, next

    after ->
      OneTimeToken.consume.restore()
      User.patch.restore()

    it 'should render an error', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          error: sinon.match.string
        })


  describe 'with valid token', ->

    before ->
      user = new User
      token = new OneTimeToken
        _id: 'misused'
        ttl: 3600
        use: 'emailVerification'
        sub: 'uuid'

      req =
        query:
          token: 'valid'
      res = render: sinon.spy()
      next = sinon.spy()

      sinon.stub(OneTimeToken, 'consume').callsArgWith(1, null, token)
      sinon.stub(User, 'patch').callsArgWith(2, null, user)

      verifyEmail req, res, next

    after ->
      OneTimeToken.consume.restore()
      User.patch.restore()

    it 'should render a response with null signin', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          signin: null
        })



  describe 'with valid token and client redirect', ->

    before ->
      user = new User
      token = new OneTimeToken
        _id: 'misused'
        ttl: 3600
        use: 'emailVerification'
        sub: 'uuid'

      req =
        query:
          token: 'valid'
        client: {}
        connectParams:
          redirect_uri:  'https://example.com/callback'
          client_id:     'client-uuid'
          response_type: 'id_token token'
          scope:         'openid profile'

      res = render: sinon.spy()
      next = sinon.spy()

      sinon.stub(OneTimeToken, 'consume').callsArgWith(1, null, token)
      sinon.stub(User, 'patch').callsArgWith(2, null, user)

      verifyEmail req, res, next

    after ->
      OneTimeToken.consume.restore()
      User.patch.restore()

    it 'should render a response with url', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          signin: {
            url: sinon.match.string
          }
        })

    it 'should render a response with client', ->
      res.render.should.have.been
        .calledWith 'verifyEmail', sinon.match({
          signin: {
            url: sinon.match.string
          }
        })



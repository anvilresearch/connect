# Test dependencies
cwd       = process.cwd()
path      = require 'path'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
OneTimeToken = require path.join(cwd, 'models/OneTimeToken')




# Redis lib for spying and stubbing
redis   = require('fakeredis')
client  = redis.createClient()
multi   = redis.Multi.prototype
rclient = redis.RedisClient.prototype




describe 'OneTimeToken', ->

  describe 'constructor', ->

    {options,token} = {}

    beforeEach ->
      options =
        exp: Date.now() + 3600
        use: 'test'
        sub: 'dim_sum'
      token = new OneTimeToken options

    it 'should generate a collision-free random id', ->
      token2 = new OneTimeToken options
      token._id.should.not.equal token2._id

    it 'should set the exp from options', ->
      token.exp.should.equal options.exp

    it 'should calculate the exp from ttl', ->
      options2 =
        ttl: 3600
        use: options.use
        sub: options.sub
      exp = Date.now() + 3600
      token2 = new OneTimeToken options2
      expect(token2.exp).to.be.within(exp - 100, exp + 100)

    it 'should set the use from options', ->
      token.use.should.equal options.use

    it 'should set the sub from options', ->
      token.sub.should.equal options.sub




  describe 'peek', ->

    {rawToken, rawExpiredToken} = {}

    before ->
      sinon.stub rclient, 'get', (key, callback) ->
        key = key.split(':')[1]
        if (key == 'valid')
          callback null, JSON.stringify(rawToken)
        else if (key == 'expired')
          callback null, JSON.stringify(rawExpiredToken)
        else if (key == 'malformed')
          callback null, 'banh_mi'
        else
          callback null, null

    after ->
      rclient.get.restore()

    beforeEach ->
      rawToken =
        _id: '4f7c3891d95a479c6385720d240916d27e12708500471a50a4b2715a9e7a5576'
        exp: Date.now() + 3600
        use: 'test'
        sub: 'spring_roll'
      rawExpiredToken =
        _id: '4f7c3891d95a479c6385720d240916d27e12708500471a50a4b2715a9e7a5576'
        exp: Date.now() - 3600
        use: 'test'
        sub: 'pho'

    describe 'with unknown token', ->

      {err,token} = {}

      before (done) ->
        OneTimeToken.peek 'unknown', (error,result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide a null value', ->
        expect(token).to.be.null

    describe 'with expired token', ->

      {err,token} = {}

      before (done) ->
        OneTimeToken.peek 'expired', (error,result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide a null value', ->
        expect(token).to.be.null

    describe 'with malformed result', ->

      {err,token} = {}

      before (done) ->
        OneTimeToken.peek 'malformed', (error,result) ->
          err = error
          token = result
          done()

      it 'should provide an error', ->
        expect(err).to.be.an.instanceof Error

      it 'should not provide a value', ->
        expect(token).to.be.undefined

    describe 'with valid token', ->

      {err,token} = {}

      before (done) ->
        OneTimeToken.peek 'valid', (error,result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide a OneTimeToken instance', ->
        expect(token).to.be.an.instanceof OneTimeToken
        token._id.should.equal rawToken._id
        token.exp.should.be.within(rawToken.exp - 100, rawToken.exp + 100)
        token.sub.should.equal rawToken.sub
        token.use.should.equal rawToken.use




  describe 'revoke', ->

    {err} = {}

    before (done) ->
      sinon.stub(rclient, 'del').callsArgWith 1, null
      OneTimeToken.revoke 'id', (error) ->
        err = error
        done()

    after ->
      rclient.del.restore()

    it 'should provide a falsy error', ->
      expect(err).to.not.be.ok

    it 'should delete the token', ->
      rclient.del.should.have.been.called




  describe 'consume', ->

    {err,token} = {}

    rawToken =
      _id: '4f7c3891d95a479c6385720d240916d27e12708500471a50a4b2715a9e7a5576'
      exp: Date.now() + 3600
      use: 'test'
      sub: 'nhung_dam'

    before (done) ->
      sinon.stub(rclient, 'get').callsArgWith 1, null, JSON.stringify(rawToken)
      sinon.stub(rclient, 'del').callsArgWith 1, null
      OneTimeToken.consume 'valid', (error,result) ->
        err = error
        token = result
        done()

    after ->
      rclient.get.restore()
      rclient.del.restore()

    it 'should provide a null error', ->
      expect(err).to.be.null

    it 'should provide a OneTimeToken instance', ->
      expect(token).to.be.an.instanceof OneTimeToken
      token._id.should.equal rawToken._id
      token.exp.should.be.within(rawToken.exp - 100, rawToken.exp + 100)
      token.use.should.equal rawToken.use
      token.sub.should.equal rawToken.sub

    it 'should revoke the token', ->
      rclient.del.should.have.been.called




  describe 'issue', ->

    {err,token} = {}

    rawToken =
      exp: Date.now() + 3600
      use: 'test'
      sub: 'nem_nuong'
    otToken = new OneTimeToken rawToken

    noexpToken =
      use: 'test'
      sub: 'banh_flan'

    beforeEach ->
      sinon.stub multi, 'set'
      sinon.stub multi, 'expireat'
      sinon.stub(multi, 'exec').callsArgWith 0, null, []

    afterEach ->
      multi.set.restore()
      multi.expireat.restore()
      multi.exec.restore()

    describe 'with raw token data', ->

      {err,token} = {}

      beforeEach (done) ->
        OneTimeToken.issue rawToken, (error, result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should store the token', ->
        multi.set.should.have.been.called
        multi.exec.should.have.been.called

      it 'should set the token to expire', ->
        multi.expireat.should.have.been.called

      it 'should provide a OneTimeToken instance', ->
        expect(token).to.be.an.instanceof OneTimeToken
        token.exp.should.be.within rawToken.exp - 100, rawToken.exp + 100
        token.use.should.equal rawToken.use
        token.sub.should.equal rawToken.sub

    describe 'with OneTimeToken instance', ->

      {err,token} = {}

      beforeEach (done) ->
        OneTimeToken.issue otToken, (error, result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should store the token', ->
        multi.set.should.have.been.calledWith(
          'onetimetoken:' + otToken._id,
          JSON.stringify(otToken)
        )

      it 'should set the token to expire', ->
        multi.expireat.should.have.been.called

      it 'should provide the same OneTimeToken instance', ->
        token.should.eql otToken

    describe 'without expiration date', ->

      {err,token} = {}

      beforeEach (done) ->
        OneTimeToken.issue noexpToken, (error, result) ->
          err = error
          token = result
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should store the token', ->
        multi.set.should.have.been.called
        multi.exec.should.have.been.called

      it 'should not set the token to expire', ->
        multi.expireat.should.not.have.been.called

      it 'should provide a OneTimeToken instance', ->
        expect(token).to.be.an.instanceof OneTimeToken

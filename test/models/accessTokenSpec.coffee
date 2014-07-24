# Test dependencies
cwd         = process.cwd()
path        = require 'path'


# Test dependencies
cwd       = process.cwd()
path      = require 'path'
Faker     = require 'Faker'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
Modinha     = require 'modinha'
AccessToken = require path.join(cwd, 'models/AccessToken')




# Redis lib for spying and stubbing
redis   = require('fakeredis')
client  = redis.createClient()
multi   = redis.Multi.prototype
rclient = redis.RedisClient.prototype
AccessToken.__client = client


describe 'AccessToken', ->

  {err,validation,instance} = {}


  #before ->

  #  # Mock data
  #  data = []

  #  for i in [0..9]
  #    data.push
  #      name:     "#{Faker.Name.firstName()} #{Faker.Name.lastName()}"
  #      email:    Faker.Internet.email()
  #      hash:     'private'
  #      password: 'secret1337'

  #  users = User.initialize(data, { private: true })
  #  jsonUsers = users.map (d) ->
  #    User.serialize(d)
  #  ids = users.map (d) ->
  #    d._id


  describe 'schema', ->

    beforeEach ->
      instance = new AccessToken
      validation = instance.validate()

    it 'should have unique identifier', ->
      AccessToken.schema[AccessToken.uniqueId].should.be.an.object

    it 'should generate a default access token', ->
      instance.at.length.should.equal 20

    it 'should require an access token', ->
      AccessToken.schema.at.required.should.equal true

    it 'should use the access token as unique identifier', ->
      AccessToken.uniqueId.should.equal 'at'

    it 'should have token type', ->
      AccessToken.schema.tt.type.should.equal 'string'

    it 'should enumerate token types', ->
      AccessToken.schema.tt.enum.should.contain 'Bearer'
      AccessToken.schema.tt.enum.should.contain 'mac'

    it 'should default token type to "Bearer"', ->
      instance.tt.should.equal 'Bearer'

    it 'should have expires in', ->
      AccessToken.schema.ei.type.should.equal 'number'

    it 'should default expires in to 3600 seconds', ->
      instance.ei.should.equal 3600

    it 'should have refresh token', ->
      AccessToken.schema.rt.type.should.equal 'string'

    it 'should index refresh token as unique', ->
      AccessToken.schema.rt.unique.should.equal true

    it 'should require client id', ->
      validation.errors.cid.attribute.should.equal 'required'

    it 'should require user id', ->
      validation.errors.uid.attribute.should.equal 'required'

    it 'should require scope', ->
      validation.errors.scope.attribute.should.equal 'required'

    # TIMESTAMPS

    it 'should have "created" timestamp', ->
      AccessToken.schema.created.default.should.equal Modinha.defaults.timestamp

    it 'should have "modified" timestamp', ->
      AccessToken.schema.modified.default.should.equal Modinha.defaults.timestamp




  describe 'indexing', ->




  describe 'exchange', ->




  describe 'issue', ->

    {res} = {}

    describe 'with invalid request', ->

      before (done) ->
        sinon.stub(AccessToken, 'insert').callsArgWith(1, new Error)
        req =
          user: {}
          client: {}
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide an error', ->
        expect(err).to.be.an.object

      it 'should not provide a value', ->
        expect(res).to.equal undefined


    describe 'with valid request', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2' }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide an "issue" projection of the token', ->
        res.access_token.length.should.equal 20

      it 'should expire in the default duration', ->
        res.expires_in.should.equal AccessToken.schema.ei.default


    describe 'with max_age parameter', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2', default_max_age: 7777 }
          connectParams: { max_age: '1000' }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should set expires_in from max_age', ->
        AccessToken.insert.should.have.been.calledWith sinon.match({
          ei: 1000
        })


    describe 'with client default_max_age property', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2', default_max_age: 7777 }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should set expires_in from default_max_age', ->
        AccessToken.insert.should.have.been.calledWith sinon.match({
          ei: 7777
        })


  describe 'refresh', ->

  describe 'revoke', ->






  #describe 'existing', ->


  #  beforeEach (done) ->
  #    token = tokens[0]
  #    sinon.stub(client, 'hget').callsArgWith 2, null, token.access
  #    sinon.stub(Token, 'get').callsArgWith 1, null, token
  #    Token.existing token.appId, token.accountId, (error, instance) ->
  #      err = error
  #      token = instance
  #      done()

  #  afterEach ->
  #    Token.get.restore()
  #    client.hget.restore()

  #  it 'should provide a null error', ->
  #    expect(err).to.be.null

  #  it 'should provide a projection', ->
  #    expect(token).not.to.be.instanceof Token

  #  it 'should have an access_token', ->
  #    token.access_token.should.equal tokens[0].access






  #describe 'revoke', ->

  #  beforeEach (done) ->
  #    token =  tokens[0]
  #    sinon.stub(client, 'hget').callsArgWith 2, null, 'fakeId'
  #    sinon.stub(Token, 'delete').callsArgWith 1, null, true
  #    Token.revoke token.accountId, token.appId, (error, result) ->
  #      err = error
  #      deleted = result
  #      done()

  #  afterEach ->
  #    client.hget.restore()
  #    Token.delete.restore()

  #  it 'should provide a null error', ->
  #    expect(err).to.be.null

  #  it 'should provide confirmation', ->
  #    deleted.should.be.true



  #describe 'verification', ->

  #  describe 'with valid details', ->

  #    before (done) ->
  #      token = tokens[0]
  #      sinon.stub(Token, 'get').callsArgWith(1, null, token)
  #      Token.verify token.access, token.scope, (error, result) ->
  #        err = error
  #        instance = result
  #        done()

  #    after ->
  #      Token.get.restore()

  #    it 'should provide a null error', ->
  #      expect(err).to.be.null

  #    it 'should provide the token', ->
  #      expect(token).to.be.instanceof Token


  #  describe 'with unknown access token', ->

  #    before (done) ->
  #      token = tokens[0]
  #      sinon.stub(Token, 'get').callsArgWith(1, null, null)
  #      Token.verify token.access, token.scope, (error, result) ->
  #        err = error
  #        instance = result
  #        done()

  #    after ->
  #      Token.get.restore()

  #    it 'should provide an "InvalidTokenError"', ->
  #      err.name.should.equal 'InvalidTokenError'

  #    it 'should not provide verification', ->
  #      expect(instance).to.be.undefined


  #  describe 'with expired access token', ->

  #    it 'should provide an "InvalidTokenError"'
  #    it 'should not provide verification'


  #  describe 'with insufficient scope', ->

  #    before (done) ->
  #      token = tokens[0]
  #      sinon.stub(Token, 'get').callsArgWith(1, null, token)
  #      Token.verify token.access, 'insufficient', (error, result) ->
  #        err = error
  #        instance = result
  #        done()

  #    after ->
  #      Token.get.restore()

  #    it 'should provide an "InsufficientScopeError"', ->
  #      err.name.should.equal 'InsufficientScopeError'

  #    it 'should not provide verification', ->
  #      expect(instance).to.be.undefined


  #  describe 'with omitted scope', ->

  #    before (done) ->
  #      token = tokens[0]
  #      sinon.stub(Token, 'get').callsArgWith(1, null, token)
  #      Token.verify token.access, undefined, (error, result) ->
  #        err = error
  #        instance = result
  #        done()

  #    after ->
  #      Token.get.restore()

  #    it 'should provide an "InsufficientScopeError"', ->
  #      err.name.should.equal 'InsufficientScopeError'

  #    it 'should not provide verification', ->
  #      expect(instance).to.be.undefined


  #  describe 'with omitted scope and defined default', ->



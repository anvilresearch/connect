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
Modinha   = require 'modinha'
Client    = require path.join(cwd, 'models/Client')
base64url = require('base64url')




# Redis lib for spying and stubbing
redis   = require('fakeredis')
client  = redis.createClient()
multi   = redis.Multi.prototype
rclient = redis.RedisClient.prototype
Client.__client = client




describe 'Client', ->


  {data,client,clients,role,roles,jsonClients} = {}
  {err,validation,instance,instances,update,deleted,original,ids,info} = {}


  before ->

    # Mock data
    #data = []

    #for i in [0..9]
    #  data.push
    #    name:     "#{Faker.Name.firstName()} #{Faker.Name.lastName()}"
    #    email:    Faker.Internet.email()
    #    hash:     'private'
    #    password: 'secret1337'

    #clients = Client.initialize(data, { private: true })
    #jsonClients = clients.map (d) ->
    #  Client.serialize(d)
    #ids = clients.map (d) ->
    #  d._id


  describe 'schema', ->

    beforeEach ->
      client = new Client
      validation = client.validate()

    it 'should have unique identifier', ->
      Client.schema[Client.uniqueId].should.be.an.object


    # CLIENT METADATA

    it 'should have redirect uris', ->
      Client.schema.redirect_uris.type.should.equal 'array'

    it 'should require at least one redirect uri'

    it 'should require redirect uris to be valid', ->
      Client.schema.redirect_uris.format.should.equal 'url'

    it 'should have response types', ->
      Client.schema.response_types.type.should.equal 'array'

    it 'should enumerate valid response types', ->
      Client.schema.response_types.enum.should.contain 'code'
      Client.schema.response_types.enum.should.contain 'id_token'
      Client.schema.response_types.enum.should.contain 'id_token token'

    it 'should have grant types', ->
      Client.schema.grant_types.type.should.equal 'array'

    it 'should enumerate valid grant types', ->
      Client.schema.grant_types.enum.should.contain 'authorization_code'
      Client.schema.grant_types.enum.should.contain 'implicit'
      Client.schema.grant_types.enum.should.contain 'refresh_token'

    it 'should have an application type', ->
      Client.schema.application_type.type.should.equal 'string'

    it 'should enumerate valid application types', ->
      Client.schema.application_type.enum.should.contain 'web'
      Client.schema.application_type.enum.should.contain 'native'

    it 'should have a default application type', ->
      Client.schema.application_type.default.should.equal 'web'

    it 'should have a list of contacts', ->
      Client.schema.contacts.type.should.equal 'array'

    it 'should require contacts to be valid emails', ->
      Client.schema.contacts.format.should.equal 'email'

    it 'should have a client name', ->
      Client.schema.client_name.type.should.equal 'string'

    it 'should have a logo uri', ->
      Client.schema.logo_uri.type.should.equal 'string'

    it 'should verify logo uri format', ->
      Client.schema.logo_uri.format.should.equal 'url'

    it 'should have a client uri', ->
      Client.schema.client_uri.type.should.equal 'string'

    it 'should verify client uri format', ->
      Client.schema.client_uri.format.should.equal 'url'

    it 'should have a policy uri', ->
      Client.schema.policy_uri.type.should.equal 'string'

    it 'should verify policy uri format', ->
      Client.schema.policy_uri.format.should.equal 'url'

    it 'should have a TOS uri', ->
      Client.schema.tos_uri.type.should.equal 'string'

    it 'should verify TOS uri format', ->
      Client.schema.tos_uri.format.should.equal 'url'

    it 'should have a jwks uri', ->
      Client.schema.jwks_uri.type.should.equal 'string'

    it 'should verify jwks uri format', ->
      Client.schema.jwks_uri.format.should.equal 'url'

    it 'should have jwks', ->
      Client.schema.jwks.type.should.equal 'string'

    it 'should have a sector identifier uri', ->
      Client.schema.sector_identifier_uri.type.should.equal 'string'

    it 'should verify sector identifier uri format', ->
      Client.schema.sector_identifier_uri.format.should.equal 'url'

    it 'should have a subject type', ->
      Client.schema.subject_type.type.should.equal 'string'

    it 'should enumerate valid subject types', ->
      Client.schema.subject_type.enum.should.contain 'pairwise'
      Client.schema.subject_type.enum.should.contain 'public'

    it 'should have id token signed response alg', ->
      Client.schema.id_token_signed_response_alg.type.should.equal 'string'

    it 'should have id token encrypted response alg', ->
      Client.schema.id_token_encrypted_response_alg.type.should.equal 'string'

    it 'should have id token encrypted response enc', ->
      Client.schema.id_token_encrypted_response_enc.type.should.equal 'string'

    it 'should have userinfo signed response alg', ->
      Client.schema.userinfo_signed_response_alg.type.should.equal 'string'

    it 'should have userinfo encrypted response alg', ->
      Client.schema.userinfo_encrypted_response_alg.type.should.equal 'string'

    it 'should have userinfo encrypted response enc', ->
      Client.schema.userinfo_encrypted_response_enc.type.should.equal 'string'

    it 'should have request object signing alg', ->
      Client.schema.request_object_signing_alg.type.should.equal 'string'

    it 'should have request object encryption alg', ->
      Client.schema.request_object_encryption_alg.type.should.equal 'string'

    it 'should have request object encryption enc', ->
      Client.schema.request_object_encryption_enc.type.should.equal 'string'

    it 'should have token endpoint auth method', ->
      Client.schema.token_endpoint_auth_method.type.should.equal 'string'

    it 'should enumerate valid token endpoint auth methods', ->
      enumeration = [
        'client_secret_basic'
        'client_secret_post'
        'client_secret_jwt'
        'private_key_jwt'
      ]
      Client.schema.token_endpoint_auth_method.enum.should.contain enumeration[0]
      Client.schema.token_endpoint_auth_method.enum.should.contain enumeration[1]
      Client.schema.token_endpoint_auth_method.enum.should.contain enumeration[2]
      Client.schema.token_endpoint_auth_method.enum.should.contain enumeration[3]

    it 'should have a default token endpoint auth method', ->
      method = 'client_secret_basic'
      Client.schema.token_endpoint_auth_method.default.should.equal method

    it 'should have token endpoint auth signing alg', ->
      Client.schema.token_endpoint_auth_signing_alg.type.should.equal 'string'

    it 'should have default max age', ->
      Client.schema.default_max_age.type.should.equal 'number'

    it 'should have require auth time', ->
      Client.schema.require_auth_time.type.should.equal 'boolean'

    it 'should have default acr values', ->
      Client.schema.default_acr_values.type.should.equal 'array'

    it 'should have initiate login uri', ->
      Client.schema.initiate_login_uri.type.should.equal 'string'

    it 'should have request uris', ->
      Client.schema.request_uris.type.should.equal 'array'

    it 'should have post logout redirect uris', ->
      Client.schema.post_logout_redirect_uris.type.should.equal 'string'

    it 'should have trusted', ->
      Client.schema.trusted.type.should.equal 'string'

    it 'should have user id', ->
      Client.schema.userId.type.should.equal 'string'

    it 'should have origins', ->
      Client.schema.origins.type.should.equal 'array'

    it 'should verify origins uri format', ->
      Client.schema.origins.format.should.equal 'url'




  describe 'configuration', ->

    {client,configuration,server,token} = {}

    before ->
      client = new Client
        client_name:  Faker.Company.companyName()
        logo_uri:                    Faker.Image.imageUrl()
        contacts:                   [Faker.Internet.email()]
        token_endpoint_auth_method: 'client_secret_basic'
        redirect_uris:              [Faker.Internet.domainName()]

      token = Faker.Helpers.randomNumber(10)
      server = { settings: { issuer: 'https://anvil.io' } }
      configuration = client.configuration server, token

    it 'should return a "registration" mapping of a client', ->
      configuration.client_id.should.equal client._id

    it 'should include "registration client uri"', ->
      uri = server.settings.issuer + '/register/' + client._id
      configuration.registration_client_uri.should.equal uri

    it 'should include "registration access token" if provided', ->
      configuration.registration_access_token.should.equal token

    it 'should include "client_id_issued_at"', ->
      configuration.client_id_issued_at.should.equal client.created




  describe 'authenticate', ->

    {err,client,req,callback} = {}

    describe 'with POST credentials and additional method', ->

      before (done) ->
        req =
          headers:
            authorization: 'Basic TOKEN'
          body:
            client_secret: 'RANDOM'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Must use only one authentication method'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined



    describe 'with JWT credentials and additional method', ->

      before (done) ->
        req =
          headers:
            authorization: 'Basic TOKEN'
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Must use only one authentication method'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with invalid client assertion type', ->

      before (done) ->
        req =
          body:
            client_assertion_type: 'INVALID'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Invalid client assertion type'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with missing client assertion', ->

      before (done) ->
        req =
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Missing client assertion'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with missing client credentials', ->

      before (done) ->
        req = {}
        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Missing client credentials'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and malformed credentials', ->

      before (done) ->
        req =
          headers:
            authorization: 'Basic ' + new Buffer('WRONG').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Malformed HTTP Basic credentials'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and invalid scheme', ->

      before (done) ->
        req =
          headers:
            authorization: 'WRONG ' + new Buffer('id:secret').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Invalid authorization scheme'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and missing credentials', ->

      before (done) ->
        req =
          headers:
            authorization: 'Basic ' + new Buffer(':WRONG').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Missing client credentials'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and unknown client', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, null)

        req =
          headers:
            authorization: 'Basic ' + new Buffer('id:secret').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Unknown client identifier'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and mismatching client secret', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, { client_secret: 'secret' })

        req =
          headers:
            authorization: 'Basic ' + new Buffer('id:WRONG').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Mismatching client secret'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with HTTP Basic and valid credentials', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, {
          _id: 'id',
          client_secret: 'secret'
        })

        req =
          headers:
            authorization: 'Basic ' + new Buffer('id:secret').toString('base64')

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should not provide an error', ->
        expect(err).to.be.null

      it 'should provide the client', ->
        client._id.should.equal 'id'




    describe 'with POST body and missing credentials', ->

      before (done) ->
        req =
          body:
            client_id: undefined,
            client_secret: 'secret'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Missing client credentials'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with POST body and unknown client', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, null)

        req =
          body:
            client_id: 'id'
            client_secret: 'secret'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Unknown client identifier'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with POST body and mismatching client secret', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, { client_secret: 'secret' })

        req =
          body:
            client_id: 'id'
            client_secret: 'WRONG'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Mismatching client secret'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with client secret JWT and missing client id', ->

      before (done) ->
        req =
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
            client_assertion: 'header.' + base64url('{}') + '.signature'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Cannot extract client id from JWT'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with client secret JWT and unknown client identifier', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, null)
        req =
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
            client_assertion: 'header.' + base64url('{"sub":"UNKNOWN"}') + '.signature'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Unknown client identifier'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with client secret JWT and missing client secret', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, {})

        req =
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
            client_assertion: 'header.' + base64url('{"sub":"id"}') + '.signature'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Missing client secret'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with client secret JWT and unverifiable token', ->

      before (done) ->
        sinon.stub(Client, 'get').callsArgWith(1, null, {
          client_secret: 'secret'
        })

        req =
          body:
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
            client_assertion: 'header.' + base64url('{"sub":"id"}') + '.signature'

        callback = sinon.spy (error, instance) ->
          err = error
          client = instance
          done()

        Client.authenticate req, callback

      after ->
        Client.get.restore()

      it 'should provide an error', ->
        err.error.should.equal 'unauthorized_client'

      it 'should provide an error_description', ->
        err.error_description.should.equal 'Invalid client JWT'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

      it 'should not provide a client', ->
        expect(client).to.be.undefined




    describe 'with private key JWT', ->


    describe 'with "none"', ->





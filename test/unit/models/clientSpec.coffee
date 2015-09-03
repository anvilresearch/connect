# Test dependencies
cwd       = process.cwd()
path      = require 'path'
faker     = require 'faker'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
mockMulti = require '../lib/multi'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
Modinha   = require 'modinha'
Client    = require path.join(cwd, 'models/Client')
Role      = require path.join(cwd, 'models/Role')
settings  = require path.join(cwd, 'boot/settings')
base64url = require('base64url')




# Redis lib for spying and stubbing
Redis   = require('ioredis')
rclient = Redis.prototype
{client,multi} = {}




describe 'Client', ->

  before ->
    client = new Redis(12345)
    multi = mockMulti(rclient)
    Client.__client = client

  after ->
    rclient.multi.restore()

  {data,client,clients,role,roles,jsonClients} = {}
  {err,validation,instance,instances,update,deleted,original,ids,info,env} = {}


  before ->

    # Mock data
    data = []

    for i in [0..9]
      data.push
        name:     "#{faker.name.firstName()} #{faker.name.lastName()}"
        email:    faker.internet.email()
        hash:     'private'
        password: 'secret1337'

    clients = Client.initialize(data, { private: true })
    jsonClients = clients.map (d) ->
      Client.serialize(d)
    ids = clients.map (d) ->
      d._id


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
      Client.schema.post_logout_redirect_uris.type.should.equal 'array'

    it 'should have trusted', ->
      Client.schema.trusted.type.should.equal 'string'

    it 'should enumerate valid trusted values', ->
      Client.schema.trusted.enum.should.contain 'true'
      Client.schema.trusted.enum.should.contain 'false'

    it 'should have a default trusted value', ->
      Client.schema.trusted.default.should.equal 'false'

    it 'should have user id', ->
      Client.schema.userId.type.should.equal 'string'

    it 'should have origins', ->
      Client.schema.origins.type.should.equal 'array'

    it 'should verify origins uri format', ->
      Client.schema.origins.format.should.equal 'url'

    it 'should have scopes', ->
      Client.schema.scopes.type.should.equal 'array'

    it 'should have a default scopes value', ->
      Client.schema.scopes.default.should.eql []




  describe 'validation', ->

    {withJWKs,withJWKsURI,withJWKsAndJWKsURI} = {}

    describe 'with either jwks or jwks_uri set', ->

      before ->
        withJWKs = Client.initialize(
          jwks: '1234567890'
        ).validate()
        withJWKsURI = Client.initialize(
          jwks_uri: 'http://example.com/jwks'
        ).validate()

      it 'should not provide an error for jwks', ->
        expect(withJWKs.errors.jwks).to.be.undefined

      it 'should not provide an error for jwks_uri', ->
        expect(withJWKs.errors.jwks_uri).to.be.undefined

    describe 'with both jwks and jwks_uri set', ->

      before ->
        withJWKsAndJWKsURI = Client.initialize(
          jwks: '1234567890'
          jwks_uri: 'http://example.com/jwks'
        ).validate()

      it 'should provide an error for jwks', ->
        expect(withJWKsAndJWKsURI.errors.jwks).to.be.an 'object'

      it 'should provide an error for jwks_uri', ->
        expect(withJWKsAndJWKsURI.errors.jwks_uri).to.be.an 'object'

    describe 'redirect_uris', ->

      describe 'with native application_type', ->

        describe 'and http scheme with localhost', ->

          before ->
            validation = Client.initialize(
              application_type: 'native'
              redirect_uris: [
                'http://localhost/callback',
                'http://localhost/callback.html'
              ]
            ).validate()

          it 'should not provide an error', ->
            expect(validation.errors.redirect_uris).to.be.undefined

        describe 'and custom scheme with localhost', ->

          before ->
            validation = Client.initialize(
              application_type: 'native'
              redirect_uris: [
                'udp://localhost/callback',
                'udp://localhost/callback.html'
              ]
            ).validate()

          it 'should not provide an error', ->
            expect(validation.errors.redirect_uris).to.be.undefined

        describe 'and custom scheme with custom host', ->

          before ->
            validation = Client.initialize(
              application_type: 'native'
              redirect_uris: [
                'udp://example.com/callback',
                'udp://example.com/callback.html'
              ]
            ).validate()

          it 'should not provide an error', ->
            expect(validation.errors.redirect_uris).to.be.undefined

        describe 'and https scheme with localhost', ->

          before ->
            validation = Client.initialize(
              application_type: 'native'
              redirect_uris: [
                'http://localhost/callback',
                'https://localhost/callback'
              ]
            ).validate()

          it 'should provide an error', ->
            expect(validation.errors.redirect_uris).to.be.an 'object'

        describe 'and http scheme with custom host', ->

          before ->
            validation = Client.initialize(
              application_type: 'native'
              redirect_uris: [
                'https://example.com/callback',
                'http://example.com/callback'
              ]
            ).validate()

          it 'should provide an error', ->
            expect(validation.errors.redirect_uris).to.be.an 'object'

      describe 'with web application_type and implicit grant_type', ->

        describe 'in development', ->

          before ->
            env = process.env.NODE_ENV
            process.env.NODE_ENV = 'development'

          after ->
            process.env.NODE_ENV = env

          describe 'and https scheme with custom host', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'https://example.com/callback',
                  'https://example.com/callback.html'
                ]
              ).validate()

            it 'should not provide an error', ->
              expect(validation.errors.redirect_uris).to.be.undefined

          describe 'and https scheme with localhost', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'https://localhost/callback',
                  'https://localhost/callback.html'
                ]
              ).validate()

            it 'should not provide an error', ->
              expect(validation.errors.redirect_uris).to.be.undefined

          describe 'and http scheme with custom host', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'http://example.com/callback',
                  'http://example.com/callback.html'
                ]
              ).validate()

            it 'should not provide an error', ->
              expect(validation.errors.redirect_uris).to.be.undefined

          describe 'and http scheme with localhost', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'http://localhost/callback',
                  'http://localhost/callback.html'
                ]
              ).validate()

            it 'should not provide an error', ->
              expect(validation.errors.redirect_uris).to.be.undefined

        describe 'in production', ->

          before ->
            env = process.env.NODE_ENV
            process.env.NODE_ENV = 'production'

          after ->
            process.env.NODE_ENV = env

          describe 'and https scheme with custom host', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'https://example.com/callback',
                  'https://example.com/callback.html'
                ]
              ).validate()

            it 'should not provide an error', ->
              expect(validation.errors.redirect_uris).to.be.undefined

          describe 'and https scheme with localhost', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'https://localhost/callback',
                  'https://localhost/callback.html'
                ]
              ).validate()

            it 'should provide an error', ->
              expect(validation.errors.redirect_uris).to.be.an 'object'

          describe 'and http scheme with custom host', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'http://example.com/callback',
                  'http://example.com/callback.html'
                ]
              ).validate()

            it 'should provide an error', ->
              expect(validation.errors.redirect_uris).to.be.an 'object'

          describe 'and http scheme with localhost', ->

            before ->
              validation = Client.initialize(
                application_type: 'web'
                grant_types: ['implicit']
                redirect_uris: [
                  'http://localhost/callback',
                  'http://localhost/callback.html'
                ]
              ).validate()

            it 'should provide an error', ->
              expect(validation.errors.redirect_uris).to.be.an 'object'

    describe 'response_types', ->

      describe 'with invalid response_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'code',
                  'id_token code',
                  'invalid_response_type'
                ]
                grant_types: [
                  'authorization_code',
                  'implicit'
                ]
              ).validate()

        it 'should provide an error', ->
          expect(validation.errors.response_types).to.be.an 'object'

      describe 'with a value containing "none" and another response_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'code',
                  'token none'
                ],
                grant_types: [
                  'authorization_code'
                ]
              ).validate()

        it 'should provide an error', ->
          expect(validation.errors.response_types).to.be.an 'object'

      describe 'with code response_type but no authorization_code grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'code'
                ]
                grant_types: [
                  'implicit'
                ]
              ).validate()

        it 'should provide an error', ->
          expect(validation.errors.response_types).to.be.an 'object'

      describe 'with id_token response_type but no implicit grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'id_token'
                ]
              ).validate()

        it 'should provide an error', ->
          expect(validation.errors.response_types).to.be.an 'object'

      describe 'with token response_type but no implicit grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'token'
                ]
              ).validate()

        it 'should provide an error', ->
          expect(validation.errors.response_types).to.be.an 'object'

      describe 'with code response_type and authorization_code grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'code'
                ]
                grant_types: [
                  'authorization_code'
                ]
              ).validate()

        it 'should not provide an error', ->
          expect(validation.errors.response_types).to.be.undefined

      describe 'with id_token response_type and implicit grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'id_token'
                ]
                grant_types: [
                  'implicit'
                ]
              ).validate()

        it 'should not provide an error', ->
          expect(validation.errors.response_types).to.be.undefined

      describe 'with token response_type and implicit grant_type', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'token'
                ]
                grant_types: [
                  'implicit'
                ]
              ).validate()

        it 'should not provide an error', ->
          expect(validation.errors.response_types).to.be.undefined

      describe 'with none response_type on its own', ->

        before ->
              validation = Client.initialize(
                response_types: [
                  'none'
                ]
              ).validate()

        it 'should not provide an error', ->
          expect(validation.errors.response_types).to.be.undefined




  describe 'configuration', ->

    {client,configuration,token} = {}

    before ->
      client = new Client
        client_name:  faker.company.companyName()
        logo_uri:                    faker.image.imageUrl()
        contacts:                   [faker.internet.email()]
        token_endpoint_auth_method: 'client_secret_basic'
        redirect_uris:              [faker.internet.domainName()]
      token = faker.random.number({ min: 1, max: 10})
      configuration = client.configuration settings, token

    it 'should return a "registration" mapping of a client', ->
      configuration.client_id.should.equal client._id

    it 'should include "registration client uri"', ->
      uri = settings.issuer + '/register/' + client._id
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




  describe 'add roles', ->

    before (done) ->
      client = clients[0]
      role = new Role

      sinon.stub(multi, 'exec').callsArgWith 0, null, []
      sinon.spy multi, 'zadd'
      Client.addRoles client, role, done

    after ->
      multi.exec.restore()
      multi.zadd.restore()

    it 'should index the role by the client', ->
      multi.zadd.should.have.been.calledWith "clients:#{client._id}:roles", role.created, role._id

    it 'should index the client by the role', ->
      multi.zadd.should.have.been.calledWith "roles:#{role._id}:clients", client.created, client._id



  describe 'remove roles', ->

    before (done) ->
      client = clients[1]
      role = new Role

      sinon.stub(multi, 'exec').callsArgWith 0, null, []
      sinon.spy multi, 'zrem'
      Client.removeRoles client, role, done

    after ->
      multi.exec.restore()
      multi.zrem.restore()

    it 'should deindex the role by the client', ->
      multi.zrem.should.have.been.calledWith "clients:#{client._id}:roles", role._id

    it 'should deindex the client by the role', ->
      multi.zrem.should.have.been.calledWith "roles:#{role._id}:clients", client._id



  describe 'list by roles', ->

    before (done) ->
      role = new Role name: 'authority'
      sinon.stub(Client, 'list').callsArgWith 1, null, []
      Client.listByRoles role.name, done

    after ->
      Client.list.restore()

    it 'should look in the clients index', ->
      Client.list.should.have.been.calledWith(
        sinon.match({ index: "roles:#{role.name}:clients" })
      )




  describe 'list authorized by user', ->

    before (done) ->
      sinon.stub(Client, 'list').callsArgWith 1, null, []
      Client.listAuthorizedByUser 'uuid', (error, results) ->
        err = error
        instances = results
        done()

    after ->
      Client.list.restore()

    it 'should look in the authorized clients index', ->
      Client.list.should.have.been.calledWith(
        sinon.match({ index: "users:uuid:clients" })
      )


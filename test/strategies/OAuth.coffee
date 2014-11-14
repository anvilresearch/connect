# Test dependencies
nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
Strategy      = require('passport-strategy')
OAuthStrategy = require '../../lib/strategies/OAuth'
provider      = require('../../lib/providers').oauthtest



describe 'OAuth Strategy', ->


  {err, res, credentials} = {}

  config =
    client_id:      'id',
    client_secret:  'secret'
    scope:          ['c']

  verify = () ->

  strategy = new OAuthStrategy provider, config, verify


  describe 'instance', ->

    it 'should inherit from Strategy', ->
      expect(strategy).to.be.instanceof Strategy


  describe 'constructor', ->

    it 'should set provider', ->
      strategy.provider.should.equal provider

    it 'should set endpoints', ->
      strategy.endpoints.should.equal provider.endpoints

    it 'should set client', ->
      strategy.client.should.equal config

    it 'should set name', ->
      strategy.name.should.equal provider.id

    it 'should set verify', ->
      strategy.verify.should.equal verify




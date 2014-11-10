# Test dependencies
nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect
FormUrlencoded = require('form-urlencoded')




# Assertions
chai.use sinonChai
chai.should()




# Code under test
Strategy = require('passport-strategy')
OAuth2Strategy = require '../../../lib/strategies/OAuth2'



describe 'OAuth2Strategy authorizationCodeGrant', ->

  describe 'with defaults and valid parameters', ->

    it 'should use the "POST" method'
    it 'should send the "grant_type" as "authorization_code"'
    it 'should send the code'
    it 'should send the redirect_uri'
    it 'should set the accept header'
    it 'should set the user agent'




  describe 'with custom method', ->
    it 'should use the correct HTTP method'




  describe 'with "client_secret_basic" auth', ->
    it 'should set the Authorization header'
    it 'should use the Basic scheme'
    it 'should set base64 encoded credentials'




  describe 'with "client_secret_post" auth', ->
    it 'should send the client_id'
    it 'should send the client_secret'




  describe 'with error response', ->
    it 'should provide an error'
    it 'should not provide a token response'




  describe 'with "x-www-form-urlencoded" response', ->
    it 'should not provide an error'
    it 'should provide the token response'




  describe 'with "JSON" response', ->
    it 'should not provide an error'
    it 'should provide the token response'





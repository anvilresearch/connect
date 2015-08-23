chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{determineProvider} = require '../../../oidc'
settings            = require '../../../boot/settings'
providers           = require '../../../providers'





describe 'Determine Provider', ->


  {req,res,next} = {}
  settingsProviders = {}


  describe 'with provider on params', ->

    before ->
      req = { method: 'GET', params: { provider: 'password' }, body: {} }
      res = {}
      next = sinon.spy()
      settingsProviders = settings.providers
      settings.providers = { 'password': {} }
      determineProvider req, res, next

    after ->
      settings.providers = settingsProviders

    it 'should load the correct provider', ->
      req.provider.should.equal providers.password

    it 'should continue', ->
      next.should.have.been.called



  describe 'with provider on body', ->

    before ->
      req = { method: 'GET', params: { }, body: { provider: 'password' } }
      res = {}
      next = sinon.spy()
      settingsProviders = settings.providers
      settings.providers = { 'password': {} }
      determineProvider req, res, next

    after ->
      settings.providers = settingsProviders

    it 'should load the correct provider', ->
      req.provider.should.equal providers.password

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unknown provider on body', ->

    before ->
      req = { method: 'GET', params: {}, body: { provider: '/\\~!@#$%^&*(_+' } }
      res = {}
      next = sinon.spy()
      settingsProviders = settings.providers
      settings.providers = { 'password': {} }
      determineProvider req, res, next

    after ->
      settings.providers = settingsProviders

    it 'should not load a provider', ->
      req.should.not.have.property 'provider'

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unconfigured provider on body', ->

    before ->
      req = { method: 'GET', params: {}, body: { provider: 'password' } }
      res = {}
      next = sinon.spy()
      settingsProviders = settings.providers
      settings.providers = {}
      determineProvider req, res, next

    after ->
      settings.providers = settingsProviders

    it 'should not load a provider', ->
      req.should.not.have.property 'provider'

    it 'should continue', ->
      next.should.have.been.called






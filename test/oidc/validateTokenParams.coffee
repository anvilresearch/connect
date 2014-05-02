chai = require 'chai'
chai.should()




{validateTokenParams} = require '../../lib/oidc'




req = (params) -> body: params
res = {}
err = null




describe 'Validate Token Parameters', ->

  describe 'all requests', ->

    describe 'with missing grant_type', ->

      before (done) ->
        params = {}
        validateTokenParams req(params), res, (error) ->
          err = error
          done()

      it 'should provide an AuthorizationError', ->
        err.name.should.equal 'AuthorizationError'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_request'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Missing grant type'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400




    describe 'with unsupported grant_type', ->

      before (done) ->
        params = { grant_type: 'unsupported' }
        validateTokenParams req(params), res, (error) ->
          err = error
          done()

      it 'should provide an AuthorizationError', ->
        err.name.should.equal 'AuthorizationError'

      it 'should provide an error code', ->
        err.error.should.equal 'unsupported_grant_type'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Unsupported grant type'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400




  describe 'authorization code grant', ->

    describe 'with missing authorization code', ->

      before (done) ->
        params = { grant_type: 'authorization_code' }
        validateTokenParams req(params), res, (error) ->
          err = error
          done()

      it 'should provide an AuthorizationError', ->
        err.name.should.equal 'AuthorizationError'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_request'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Missing authorization code'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400




    describe 'with missing redirect_uri', ->

      before (done) ->
        params = { grant_type: 'authorization_code', code: 'bogus' }
        validateTokenParams req(params), res, (error) ->
          err = error
          done()

      it 'should provide an AuthorizationError', ->
        err.name.should.equal 'AuthorizationError'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_request'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Missing redirect uri'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400




  describe 'refresh token grant', ->

    describe 'with missing refresh token', ->

      before (done) ->
        params = { grant_type: 'refresh_token' }
        validateTokenParams req(params), res, (error) ->
          err = error
          done()

      it 'should provide an AuthorizationError', ->
        err.name.should.equal 'AuthorizationError'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_request'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Missing refresh token'

      it 'should provide a status code', ->
        err.statusCode.should.equal 400

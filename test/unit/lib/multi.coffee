Redis = require 'ioredis'
client = Redis.prototype

multi = {}
multiOld = client.multi
multiMethods = []

for key of client
  if typeof client[key] == 'function'
    multiMethods.push key

multiMethods.forEach (prop) ->
  multi[prop] = ->
    multi
  return

multi.exec = ->
  throw new Error('exec called without being stubbed')
  return

module.exports = (client) ->
  client.multi = ->
    multi

  client.multi.restore = ->
    client.multi = multiOld
    return

  multi

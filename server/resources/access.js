var Boom = require('boom')
var server = require('../index').hapi
var log = require('../helpers/logger')
var threadFromPath = require('../helpers/threadFromPath')
var Access = require('../db/access')

server.method('access.save', save, {})
server.method('access.get', get, {})

function save (memberId, path, id, cb) {
  var thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  var filter = { member: memberId, thread: thread }
  var access = {
    member: memberId,
    thread: thread,
    last: Date.now()
  }

  Access.findOneAndUpdate(filter, access, {upsert: true}, function (err, savedAccess) {
    if (err) {
      log.error({err: err, access: access})
      return cb(Boom.internal())
    }

    return cb(null, savedAccess)
  })
}

function get (memberId, path, id, cb) {
  var thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  var filter = { member: memberId, thread: thread }

  Access.findOne(filter, function (err, savedAccess) {
    if (err) {
      log.error({err: err, access: filter})
      return cb(Boom.internal())
    }

    return cb(null, savedAccess)
  })
}

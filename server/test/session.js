var Lab = require('lab')
var Code = require('code')

var server = require('../').hapi

var lab = exports.lab = Lab.script()

var sessionA = {
  id: 'john.doe',
  name: 'John Doe',
  event: 'test-event'
}

var sessionId = sessionA.id + '-' + sessionA.event

var changesSessionA = {
  name: 'Jane Doe'
}

var credentials = {
  id: 'john.doe',
  name: 'John Doe',
  participations: [{
    role: 'development-team',
    event: '1000-sinfo'
  }]
}

lab.experiment('Session', function () {
  lab.test('Create', function (done) {
    var options = {
      method: 'POST',
      url: '/api/sessions',
      credentials: credentials,
      payload: sessionA
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(201)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.id).to.equal(sessionId)
      Code.expect(result.name).to.equal(sessionA.name)

      done()
    })
  })

  lab.test('List all', function (done) {
    var options = {
      method: 'GET',
      url: '/api/sessions',
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Array)
      Code.expect(result[0].id).to.be.string
      Code.expect(result[0].name).to.be.string

      done()
    })
  })

  lab.test('Get one', function (done) {
    var options = {
      method: 'GET',
      url: '/api/sessions/' + sessionId,
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.id).to.equal(sessionId)
      Code.expect(result.name).to.equal(sessionA.name)

      done()
    })
  })

  lab.test('Update', function (done) {
    var options = {
      method: 'PUT',
      url: '/api/sessions/' + sessionId,
      credentials: credentials,
      payload: changesSessionA
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.id).to.equal(sessionId)
      Code.expect(result.name).to.equal(changesSessionA.name)

      done()
    })
  })

  lab.test('Delete', function (done) {
    var options = {
      method: 'DELETE',
      url: '/api/sessions/' + sessionId,
      credentials: credentials
    }

    server.inject(options, function (response) {
      var result = response.result

      Code.expect(response.statusCode).to.equal(200)
      Code.expect(result).to.be.instanceof(Object)
      Code.expect(result.id).to.equal(sessionId)
      Code.expect(result.name).to.equal(changesSessionA.name)

      done()
    })
  })
})

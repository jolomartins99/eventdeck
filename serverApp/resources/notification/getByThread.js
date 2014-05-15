var async          = require('async');
var Notification   = require('./../../db/models/notification.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var threadId;
  var notifications;

  if(request.path.indexOf('/api/company/') != -1) {
    threadId = 'company-'+request.params.id;
  }
  else if(request.path.indexOf('/api/speaker/') != -1) {
    threadId = 'speaker-'+request.params.id;
  }

  async.series([
      getNotifications,
    ], done);

  function getNotifications(cb) {
    Notification.findByThread(threadId, gotNotifications);

    function gotNotifications(err, result) {
      if (err) cb(err);
      notifications = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(notifications);
    }
  }
}
var async = require('async');
var servers = require('server');
var log = require('server/helpers/logger');
var IO = servers.socket.server;
var server = servers.hapi;
var render = require('server/views/notification');

var events = {
  count: 'notification-count',
  countResp: 'notification-count-response',
  get: 'notifications-get',
  getResp: 'notifications-get-response',
  getPublic: 'notifications-public-get',
  getPublicResp: 'notifications-public-get-response',
  notify: 'notify',
  notifyTarget: 'notify-target',
  notifySubscripton: 'notify-subscription',
  notifyPublic: 'notify-public',
  access: 'access'
};

var validators = {
  count: Joi.object().keys({
    data: Joi.object().keys({
      id: Joi.string().required().description('id of the member')
    }),
    options: Joi.object().keys({
      data: Joi.object().keys({
        fields: Joi.string().default('').description('Fields we want to retrieve'),
        skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
        limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
        sort: Joi.string().description('How to sort the array'),
      })
    })
  }),

  get: Joi.object().keys({
    options: Joi.object().keys({
      data: Joi.object().keys({
        fields: Joi.string().default('').description('Fields we want to retrieve'),
        skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
        limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
        sort: Joi.string().description('How to sort the array'),
      })
    })
  }),

  getPublic: Joi.object().keys({
    options: Joi.object().keys({
      data: Joi.object().keys({
        fields: Joi.string().default('').description('Fields we want to retrieve'),
        skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
        limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
        sort: Joi.string().description('How to sort the array'),
      })
    })
  }),

  notify: Joi.object().keys({
    data: Joi.object().keys({
      thread: Joi.string().description('The thread of the notification'),
      source: Joi.string().uri().description('The source of the thread'),
      member: Joi.string().description('The member from whom the notification comes'),
      description: Joi.string().description('Description of the notification'),
      targets: Joi.array().items(Joi.string()).description('Targets to be notified'),
      posted: Joi.date()
    })
  }),

  access: Joi.object().keys({
    data: Joi.object().keys({
      thread: Joi.string().description('The accessed thread'),
      member: Joi.string().description('Id of the member'),
      last: Joi.date()
    })
  }),
};

function notificationListeners(socket){

  socket.on(events.count, function(request, cbClient){
    Joi.validate(request, validators.count, function(err, value){
      if(err){
        cbClient(Boom.badRequest('Invalid request', err));
      }
    });
    var query = request.options.data || {};
    var data = request.data || {};
    server.methods.notification.getUnreadCount(data.id, query, function(err, result){
      if(err){
        log.error({err: err, user: data.id, notifications: result}, '[socket-notification] error getting notification count');
        socket.emit(events.countResp, {err: err});
        return cbClient(err);
      }
      socket.emit(events.countResp, {response: result});
      cbClient();
    });
  });

  socket.on(events.get, function(request, cbClient){
    Joi.validate(request, validators.get, function(err, value){
      if(err){
        cbClient(Boom.badRequest('Invalid request', err));
      }
    });
    var query = request.options.data || {};
    server.methods.notification.getByMember(socket.nickname, query, function(err, notifications){
      if(!notifications){
        socket.emit(events.getResp, {response: []});
        return cbClient();
      }
      server.methods.notification.decorateWithUnreadStatus(socket.nickname, notifications, function(err, result){
        if(err){
          log.error({err: err, user: socket.nickname, notifications: result}, '[socket-notification] error getting notifications');
          socket.emit(events.getResp, {err: err});
          return cbClient(err);
        }
        socket.emit(events.getResp, {response: render(result)});
        cbClient();
      });
    });
  });

  socket.on(events.getPublic, function(request, cbClient){
    Joi.validate(request, validators.getPublic, function(err, value){
      if(err){
        cbClient(Boom.badRequest('Invalid request', err));
      }
    });
    var query = request.options.data || {};
    server.methods.notification.list(query, function(err, notifications){
      if(err){
        log.error({err: err, user: socket.nickname, notifications: notifications}, '[socket-notification] error getting public notifications');
        socket.emit(events.getPublicResp, {err: err});
        return cbClient(err);
      }
      socket.emit(events.getPublicResp, {response: render(notifications)});
      cbClient();
    });
  });

  socket.on('notification-get', function(request, cbClient){
    //TODO notification fetch by id
  });

  socket.on(events.notify, function(request, cbClient){

    Joi.validate(request, validators.notify, function(err, request){
      if(err){
        cbClient(Boom.badRequest('Invalid request', err));
      }
    });

    var notification = request.data;
    if(notification.targets.length){
      async.each(notification.targets, function(target, cb){
        IO.to(target).emit(events.notifyTarget, {response: render(notification)});
        cb();
      });
      return cbClient();
    }

    server.methods.subscription.getByThread(notification.thread, function(err, subscriptions){
      if(err){
        log.error({err: err, subscription: notification.thread}, '[socket-notification] error getting subscriptions');
        return cbClient(err);
      }
      async.each(subscriptions, function(subscription, cb){
        if(subscription.member === notification.member){
          return cb();
        }

        IO.to(subscription.member).emit(events.notifySubscripton, {response: render(notification)});
        cb();
      });
    });
    IO.emit(events.notifyPublic, {response: render(notification)});
    cbClient();
  });

  socket.on(events.access, function(request, cbClient){
    Joi.validate(request, validators.access, function(err, request){
      if(err){
        cbClient(Boom.badRequest('Invalid request', err));
      }
    });

    var data = request.data || {};
    server.methods.access.save(data.memberId, data.thread, function(err, result){
      if(err){
        log.error({err: err, access: result}, '[socket-notification] error saving access');
      }
      cbClient(err);
    });
  });

}

module.exports = {setListeners: notificationListeners, events: events};
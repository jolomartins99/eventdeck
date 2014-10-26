var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Chat = require('server/db/models/chat');


server.method('chat.create', create, {});
server.method('chat.update', update, {});
server.method('chat.get', get, {});
server.method('chat.list', list, {});
server.method('chat.remove', remove, {});


function create(chat, memberId, cb) {
  Chat.create(chat, function(err, _chat) {
    if (err) {
      log.error({ err: err, chat: chat}, 'error creating chat');
      return cb(Boom.internal());
    }

    cb(null, _chat);
  });
}

function update(id, chat, cb) {
  var filter = {_id: id};
  Chat.findOneAndUpdate(filter, chat, function(err, _chat) {
    if (err) {
      log.error({ err: err, chat: id}, 'error updating chat');
      return cb(Boom.internal());
    }
    if (!_chat) {
      log.warn({ err: 'not found', chat: id}, 'error updating chat');
      return cb(Boom.notFound());
    }

    cb(null, _chat);
  });
}

function get(id, cb) {
  var filter = {_id: id};
  Chat.findOne(filter, function(err, chat) {
    if (err) {
      log.error({ err: err, chat: id}, 'error getting chat');
      return cb(Boom.internal());
    }
    if (!chat) {
      log.warn({ err: 'not found', chat: id}, 'error getting chat');
      return cb(Boom.notFound());
    }

    cb(null, chat);
  });
}

function list(cb) {
  Chat.find({}, function(err, chats) {
    if (err) {
      log.error({ err: err}, 'error getting all chats');
      return cb(Boom.internal());
    }
    
    cb(null, chats);
  });
}

function remove(id, cb) {
  var filter = {_id: id};
  Chat.findOneAndRemove(filter, function(err, chat){
    if (err) {
      log.error({ err: err, chat: id}, 'error deleting chat');
      return cb(Boom.internal());
    }
    if (!chat) {
      log.error({ err: err, chat: id}, 'error deleting chat');
      return cb(Boom.notFound());
    }

    return cb(null, chat);
  });
}
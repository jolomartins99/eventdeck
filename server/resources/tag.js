var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Tag = require('server/db/models/tag');


server.method('tag.create', create, {});
server.method('tag.update', update, {});
server.method('tag.get', get, {});
server.method('tag.list', list, {});
server.method('tag.remove', remove, {});


function create(tag, memberId, cb) {
  tag.id = tag.id || slug(tag.name);

  Tag.create(tag, function(err, _tag) {
    if (err) {
      log.error({ err: err, tag: tag}, 'error creating tag');
      return cb(Boom.internal());
    }

    cb(null, _tag);
  });
};

function update(id, tag, cb) {
  Tag.findOneAndUpdate({id: id}, tag, function(err, _tag) {
    if (err) {
      log.error({ err: err, tag: id}, 'error updating tag');
      return cb(Boom.internal());
    }
    if (!_tag) {
      log.warn({ err: 'not found', tag: id}, 'error updating tag');
      return cb(Boom.notFound());
    }

    cb(null, _tag);
  });
};

function get(id, cb) {
  Tag.findOne({id: id}, function(err, tag) {
    if (err) {
      log.error({ err: err, tag: id}, 'error getting tag');
      return cb(Boom.internal());
    }
    if (!tag) {
      log.warn({ err: 'not found', tag: id}, 'error getting tag');
      return cb(Boom.notFound());
    }

    cb(null, tag);
  });
};

function list(cb) {
  Tag.find({}, function(err, tags) {
    if (err) {
      log.error({ err: err}, 'error getting all tags');
      return cb(Boom.internal());
    }
    
    cb(null, tags);
  });
};

function remove(id, cb) {
  Tag.findOneAndRemove({id: id}, function(err, tag){
    if (err) {
      log.error({ err: err, tag: id}, 'error deleting tag');
      return cb(Boom.internal());
    }
    if (!tag) {
      log.error({ err: err, tag: id}, 'error deleting tag');
      return cb(Boom.notFound());
    }

    return cb(null, tag);
  });
};
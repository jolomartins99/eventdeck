var Hapi = require('hapi');
var SocketIO = {server: require('socket.io'), client: require('socket.io-client')};
var cookieConfig = require('config').cookie;
var config = require('config');
var log = require('server/helpers/logger');

log.error('### Starting EventDeck ###');

var server = module.exports.hapi = new Hapi.Server(config.port);

require('./db');

server.pack.register([
    { plugin: require('hapi-swagger'), options: config.swagger }, 
    require('hapi-auth-cookie'),
  ], 
  function (err) {

  server.auth.strategy('session', 'cookie', {
    cookie: cookieConfig.name,
    password: cookieConfig.password,
    ttl: 2592000000,
/*  appendNext: true,
    redirectTo: '/login',
    redirectOnTry: true,
    isSecure: false,
    isHttpOnly: false,*/
    isSecure: false,
  });

  require('./resources');
  require('./routes');

  server.start(function () {
    log.info('Server started at: ' + server.info.uri);
    // var webSocket = module.exports.webSocket = {
    //   server: SocketIO.server.listen(server.listener)
    // };
    // var sockets = require('./sockets');
    // webSocket.client = module.exports.webSocket.client = SocketIO.client.connect('http://localhost:' + server.info.port + '/chat');
    // var crono  = require('./scripts/crono');
    // var reminders = require('./resources/reminder');
    // reminders(null, function(stuff){});
    // crono.reminder.start();
  });

});

var webSocket = require('./../index.js').webSocket;
var async = require('async');
var Chat = require('./../resources/chat');
var Message = require('./../resources/message');

var outChat;
var messages;
var message;
var messageData;

webSocket
  .of('/chat')
  .on('connection', function (socket) {
    console.log("Connected to main chat!");
    /*socket.emit('init', { message: 'welcome to the chat' });*/
      socket.on('auth', function(data, cbClient){
        console.log("Chat ID: " + data.id);

        var room = data.id;

        async.parallel([
          function(cb){
            getChat(room, cb)
          },
          function(cb){
            getMessages(room, cb)
          }
        ], function(){
            done(room, socket, cbClient);
        });
      });

      socket.on('send', function(data, cbClient){
        console.log("Sent message Chat ID: " + data.room);

        var room = data.room;

        async.series([
          function(cb){
            createMessage(messageData, cb)
          },
          function(cb){
            updateChat(room, messageId, cb)
          }
        ], function(){
            socket.in(room).emit('message', messageData);
            cbClient();
        });
      });
  });

function getChat(chatID, cb){
  Chat.get({params:{id: chatID}}, function(response) {
    if(response.error) {
      console.log('Chat id: ' + chatID + ' unavailable');
    } 
    else {
      console.log('Logged in chat id: ' + chatID );
      message = 'Logged in chat with sucess';
      outChat = response;
    }
    cb();
  });
}

function getMessages(chatID, cb){
  Message.getByChatId({params:{id: chatID}}, function(response){
    if(response.error) {
      console.log('Chat id: ' + chatID + ' messages unavailable');
    } 
    else {
      console.log('Got messages in chat id: ' + chatID );
      messages = response;
    }
    cb();
  });
}

function done(room, socket, cb){
  socket.join(room);
  var data = {
    room     : room,
    chatData : outChat,
    messages : messages,
    message  : message
  }
  cb(data);
}

function createMessage(messageData, cb){
  MessageFactory.create(messageData, function(response){
    if(response.error) {
      console.log('Message creation error!');
      console.log(response.error);
    } else {
      messageData.id = response.messageId;
    }
    cb();
  });
}

function updateChat(room, messageId, cb){
  ChatFactory.Chat.update({ id: room }, {message: messageId}, function(response) {
    // if successful, we'll need to refresh the chat list
    if(response.error) {
      console.log('Chat id: ' + chatID + ' update error!');
      console.log(response.error);
    } else {
      console.log('Chat id: ' + chatID + ' updated successfully!');
    }
    cb();
  });
}
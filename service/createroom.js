'use strict'

var Redis = require('ioredis');

function CreateRoom(requestid, clientid, brokerid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  if (clientid) {
    if (brokerid) {
      if (requestid) {

        var chatformat = { message: "Hello thank you for helping me.", from: clientid, type: "text", created: Date.now() }

        db.keys('chatroom.' + requestid +"."+ clientid +"."+ brokerid, function(err, chatroom){
          console.log('chatroom: ', chatroom.length);
          if (chatroom.length === 0) {
            console.log('no existing, create the room.');
            db.lpush('chatroom.' + requestid +"."+ clientid +"."+ brokerid, JSON.stringify(chatformat));
            cb("success","chatroom created");
            // the client must also subscribe to this room.
          }else{
            console.log('existing, create the room not valid.');
            cb("invalid","chatroom exist");
          }
        });

      } else { cb("invalid","No requestid"); }
    } else{ cb("invalid", "No brokerid"); }
  } else{ cb("invalid", "No clientid"); }
}

module.exports = CreateRoom;

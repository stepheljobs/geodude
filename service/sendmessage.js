'use strict'

var Redis = require('ioredis');

function SendMessage(roomid, message, userid, type, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if (roomid) {
    if (message) {
      if (userid) {
        if (type) {

          var chatformat = { message: message, from: userid, type: type, created: Date.now() }
          db.lpush(roomid, JSON.stringify(chatformat));
          //return a message to sender.
          // cb('success', chatformat);

          //subscribe first to your room then publish.
          db.psubscribe(roomid, function (err, count) {
            console.log("count: ", count);
            console.log("err: ", err);
            console.log(userid + " subscribed to chatroom: " + roomid);
          });

          db.on('pmessage', function (pattern, channel, message) {
            console.log('sub pattern: ', pattern);
            console.log('sub channel: ', channel);
            console.log('sub message: ', message);
            // callback(message);
            cb('broadcast', message);
          });

          db.on('pmessageBuffer', function (pattern, channel, message) {
            console.log('sub pattern: ', pattern);
            console.log('sub channel: ', channel);
            console.log('sub message: ', message);
          });

          db.publish(roomid, chatformat); //broadcast to client

        } else { cb('invalid', 'no usertype.') }
      } else{ cb('invalid', 'no userid.') }
    } else { cb('invalid', 'no message.') }
  } else { cb('invalid', 'no room id.') }
}

module.exports = SendMessage;

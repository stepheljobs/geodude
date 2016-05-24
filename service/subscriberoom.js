'use strict'

var Redis = require('ioredis');

function SubscribeRoom(roomid, cb) {

  var sub = new Redis({port: 6379, host: '127.0.0.1'});

  if(roomid){
    sub.psubscribe(roomid, function (err, count) {
      console.log("count: ", count);
      console.log("err: ", err);
      console.log("subscribed to chatroom: " + roomid);
      cb('success', 'User is now subscribed to room '+ roomid);
    });

    sub.on('pmessage', function (pattern, channel, newmessage) {
      console.log('sub pattern: ', pattern);
      console.log('sub channel: ', channel);
      console.log('sub message: ', newmessage);
      var min = 0, max = -1;
      console.log('>> pattern: ', pattern);
      sub.lrange(pattern, min, max, function (err, messages) {
        console.log('>> messages: ', messages);
        messages.map(function(oldmsg, iter, total) {
          console.log('>> newmessage: ', newmessage);
          console.log('>> oldmsg: ', oldmsg);
          if(oldmsg != newmessage){
            cb('broadcast', newmessage);
          }
        });
      });

    });

    sub.on('pmessageBuffer', function (pattern, channel, message) {
      console.log('sub pattern: ', pattern);
      console.log('sub channel: ', channel);
      console.log('sub message: ', message);
    });
  }else{
    cb('invalid', 'no room id to subscribe');
  }
}

module.exports = SubscribeRoom;

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

    sub.on('pmessage', function (pattern, channel, message) {
      console.log('sub pattern: ', pattern);
      console.log('sub channel: ', channel);
      console.log('sub message: ', message);
      cb('broadcast', message);
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

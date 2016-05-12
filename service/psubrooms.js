'use strict'

var Redis = require('ioredis');

function PsubRooms(requestid, clientid, brokerid, callback) {
  console.log("requestid: ", requestid, "clientid: ", clientid, "brokerid: ", brokerid);
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  // var channel = myid+"."+myrequestid;
  var channel = "chatroom."+requestid+"."+clientid+"."+brokerid;
  console.log('channel: ', channel);
  sub.psubscribe(channel, function (err, count) {
    console.log("PsubRooms count: ", count);
    console.log("PsubRooms err: ", err);
    console.log("PsubRooms subscribed to channel: " + channel);
  });
  sub.on('pmessage', function (pattern, channel, message) {
    console.log('PsubRooms pattern: ', pattern);
    console.log('PsubRooms channel: ', channel);
    console.log('PsubRooms message: ', message);
    callback(message);
  });
  sub.on('pmessageBuffer', function (pattern, channel, message) {
    console.log('PsubRooms pattern: ', pattern);
    console.log('PsubRooms channel: ', channel);
    console.log('PsubRooms message: ', message);
  });
}

module.exports = PsubRooms;

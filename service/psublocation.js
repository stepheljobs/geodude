'use strict'

var Redis = require('ioredis');

function PsubLocation(location, cb) {
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  var startswithSpace = location.startsWith(" ");
  if(startswithSpace) {
    location = location.replace(" ", "");
  }
  sub.psubscribe('*.'+location, function (err, count) {
    console.log("new user is now subscribed to: ", location);
    console.log("count: ", count);
    if (err) {
      console.log("err: ", err);
    }
  });
  sub.on('pmessage', function (pattern, channel, message) {
    // console.log('sub pattern: ', pattern);
    // console.log('sub channel: ', channel);
    // console.log('sub message: ', message);
    console.log('---------->psublocation receive a broadcast', message);
    cb(null, message);
  });
  sub.on('pmessageBuffer', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
  });
}

module.exports = PsubLocation;

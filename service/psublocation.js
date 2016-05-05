'use strict'

var Redis = require('ioredis');

function PsubLocation(location, cb) {
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  sub.psubscribe('*.'+location, function (err, count) {
    console.log("new user is now subscribed to: ", location);
    console.log("count: ", count);
    console.log("err: ", err);
  });
  sub.on('pmessage', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
    if(cb) cb(message);
  });
  sub.on('pmessageBuffer', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
  });
}

module.exports = PsubLocation;

'use strict'

var Redis = require('ioredis');

function PsubLocation(location) {
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  sub.psubscribe('*.'+location, function (err, count) {
    console.log("count: ", count);
    console.log("err: ", err);
  });
  sub.on('pmessage', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
  });
  sub.on('pmessageBuffer', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
  });
}

module.exports = PsubLocation;

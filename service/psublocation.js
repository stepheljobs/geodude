'use strict'

var Redis = require('ioredis');

function PsubLocation(location) {
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  sub.psubscribe('*.'+location, function (err, count) {
    console.log("count: ", count);
    console.log("err: ", err);
  });
}

module.exports = PsubLocation;

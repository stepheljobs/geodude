'use strict'

var Redis = require('ioredis');

function PsubRequest(myid, myrequestid, callback) {
  console.log("psubrequest: ", myid, "requestid: ", myrequestid);
  var sub = new Redis({port: 6379, host: '127.0.0.1'});
  // var channel = myid+"."+myrequestid;
  var channel = myid+"."+myrequestid;
  console.log('channel: ', channel);

  sub.psubscribe(channel, function (err, count) {
    console.log("count: ", count);
    console.log("err: ", err);
    console.log(myid + " subscribed to requestid: " + myrequestid);
  });
  sub.on('pmessage', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
    console.log('----------> receive a broadcast');
    callback(message);
  });
  sub.on('pmessageBuffer', function (pattern, channel, message) {
    console.log('sub pattern: ', pattern);
    console.log('sub channel: ', channel);
    console.log('sub message: ', message);
  });
}

module.exports = PsubRequest;

'use strict'

var Redis = require('ioredis');

function FetchAllMsg(roomid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if (roomid) {
    var min = 0, max = -1;
    db.lrange(roomid, min, max, function (err, messages) {
      console.log(roomid + " messages: ", messages);
      cb('success', messages);
    });
  } else {
    cb('invalid', 'no roomid.');
  }
}

module.exports = FetchAllMsg;

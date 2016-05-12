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

          //publish to other side.
          

        } else { cb('invalid', 'no usertype.') }
      } else{ cb('invalid', 'no userid.') }
    } else { cb('invalid', 'no message.') }
  } else { cb('invalid', 'no room id.') }
}

module.exports = SendMessage;

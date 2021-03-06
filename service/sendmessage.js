'use strict'

var Redis = require('ioredis');
var sendMsgPNotif = require('../service/sendmsgpnotif');

function SendMessage(roomid, message, userid, type, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if (roomid) {
    if (message) {
      if (userid) {
        if (type) {

          db.hgetall('hm-user.'+userid, function(err, user){
            if(user.credits != 0){
              var chatformat = { message: message, from: userid, type: type, created: Date.now() }
              db.lpush(roomid, JSON.stringify(chatformat));
              //return a message to sender.
              cb('success', chatformat);
              console.log('-------> publish > sendmessage');
              db.publish(roomid, JSON.stringify(chatformat)); //broadcast to client
              sendMsgPNotif(chatformat, roomid);
            }else{
              cb('invalid', 'your token is already 0');
            }
          });

        } else { cb('invalid', 'no usertype.') }
      } else{ cb('invalid', 'no userid.') }
    } else { cb('invalid', 'no message.') }
  } else { cb('invalid', 'no room id.') }
}

module.exports = SendMessage;

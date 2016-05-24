'use strict'
var Redis = require('ioredis');
var lazy = require("lazy.js");

function ValidateMessage(channel,newmessage, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var min = 0, max = -1;
  var isDuplcated = false;
  var nwMsg = [];

  db.lrange(channel, min, max, function (err, messages) {
    console.log('---> messages: ', messages);
    nwMsg.push(newmessage);
    isDuplcated = lazy(messages).contains(nwMsg);
    console.log('---> isDuplcated', isDuplcated);

    setTimeout(function(){
      if(!isDuplcated) {
        cb(newmessage);
      } else {
        console.log('---> duplicated');
      }
    },1000);
  });

}

module.exports = ValidateMessage;

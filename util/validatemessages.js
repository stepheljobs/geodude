'use strict'
var Redis = require('ioredis');
var lazy = require('lazy.js');

function ValidateMessage(channel,newmessage, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var min = 0, max = -1;
  var isDuplcated = false;

  db.lrange(channel, min, max, function (err, messages) {
    console.log('---> messages: ', messages);
    var isDuplcated = lazy(messages).contains(newmessage).value();
    console.log('---> isDuplcated', isDuplcated);
    setTimeout(function(){
      if(!isDuplcated) {
        cb(newmessage);
      } else {
        console.log('---> duplicated');
      }
    },500);
  });

}

module.exports = ValidateMessage;

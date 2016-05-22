'use strict';

var Redis = require('ioredis');
var saveToken = require('../service/savetoken');

function PushNotif(req, cb) {
  console.log(' ------> PushNotif ');
  // var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'savetoken':
        saveToken(req.payload, function(status, result){
          cb(status, result);
        });
      break;
    default:
  }
}

module.exports = PushNotif;

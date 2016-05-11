'use strict';

var Redis = require('ioredis');
var randomstring = require('randomstring');
var createroom = require('../service/createroom');

function Chat(req, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  switch (req.route.action) {
    case 'create': //
      var requestid = req.payload.requestid;
      var clientid = req.payload.clientid;
      var brokerid = req.payload.brokerid;
      createroom(requestid, clientid, brokerid, function(status,result){
        cb(status, result);
      });
    break;
  }

}

module.exports = Chat;

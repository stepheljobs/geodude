'use strict';

var Redis = require('ioredis');
var randomstring = require('randomstring');
var createroom = require('../service/createroom');
var fetchallrooms = require('../service/fetchallrooms');
var fetchallmsg = require('../service/fetchallmsg');

function Chat(req, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  switch (req.route.action) {
    case 'create':
      var requestid = req.payload.requestid;
      var clientid = req.payload.clientid;
      var brokerid = req.payload.brokerid;
      createroom(requestid, clientid, brokerid, function(status,result){
        cb(status, result);
      });
    break;
    case 'fetchallrooms':
      var userid = req.payload.userid;
      var usertype = req.payload.usertype;
      fetchallrooms(userid, usertype, function(status,result){
        cb(status, result);
      });
    break;
    case 'fetchallmsg':
    var roomid = req.payload.roomid;
    fetchallmsg(roomid, function(status, result){
      cb(status, result);
    });
    break;
    case 'sendmsg':
    var roomid = req.payload.roomid;
    var message = req.payload.message;
    var userid = req.payload.userid;
    var type = req.payload.type;
    sendmessage(roomid, message, userid, type, function(status, result){
      cb(status, result);
    });
    break;
  }

}

module.exports = Chat;

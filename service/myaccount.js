'use strict'

var Redis = require('ioredis');

function MyAccount(userid, cb) {
  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if(userid){
    db.hgetall('hm-user.'+userid, function(err, userprofile){
      cb(null, userprofile);
    });
  }else{
    cb(null, "No Userid");
  }
}

module.exports = MyAccount;

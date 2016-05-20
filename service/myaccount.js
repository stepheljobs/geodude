'use strict'

var Redis = require('ioredis');

function MyAccount(userid, cb) {
  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if(userid){
    db.hgetall('hm-user.'+userid, function(err, userprofile){
      var User = {
        id: userprofile.id,
        member_since: userprofile.member_since,
        email: userprofile.email,
        first_name: userprofile.first_name,
        last_name: userprofile.last_name,
        user_type: userprofile.user_type,
        archive_request: userprofile.archive_request,
        archive_match: userprofile.archive_match,
        subscribed_rooms: userprofile.subscribed_rooms,
        photo: userprofile.photo,
        latest_request: userprofile.latest_request || ''
      }
      cb(null, User);
    });
  }else{
    cb(null, "No Userid");
  }
}

module.exports = MyAccount;

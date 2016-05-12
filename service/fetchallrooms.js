'use strict'

var Redis = require('ioredis');

function FetchAllRooms(userid, usertype, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if (userid) {
    if (usertype) {
      if (usertype === "BROKER") {
        db.keys('chatroom.*'+userid, function(err, listofrooms){
          // [ 'chatroom.84NKQxFZ.FjVzcosl.15WaQywp' ]

          var arrayRoom = [];
          listofrooms.map(function(room, iter, total){
            var min = 0, max = -1;

            var rooms = {
              roomid: room,
              photo: '',
              fullname: '',
              latestmsg: ''
            }

            db.lrange(room, min, max, function (err, messages) {
              console.log("messages: ", messages[0]);
              rooms.latestmsg = JSON.parse(messages[0]);
              db.hgetall('hm-user.'+userid, function(err, profile){
                rooms.photo = profile.photo;
                rooms.fullname = profile.first_name + " " + profile.last_name;
                arrayRoom.push(rooms);

                if(iter === total.length - 1){
                  cb("success",arrayRoom);
                }
              });
            });
          });

        });
      } else if (usertype === "CLIENT") {
        db.keys('chatroom.*.'+userid+'.*', function(err, listofrooms){
          // [ 'chatroom.84NKQxFZ.FjVzcosl.15WaQywp' ]
          var arrayRoom = [];
          listofrooms.map(function(room, iter, total){
            var min = 0, max = -1;

            var rooms = {
              roomid: room,
              photo: '',
              fullname: '',
              latestmsg: ''
            }

            db.lrange(room, min, max, function (err, messages) {
              console.log("messages: ", messages[0]);
              rooms.latestmsg = messages[0];
              db.hgetall('hm-user.'+userid, function(err, profile){
                rooms.photo = profile.photo;
                rooms.fullname = profile.first_name + " " + profile.last_name;
                arrayRoom.push(rooms);

                if(iter === total.length - 1){
                  cb("success",arrayRoom);
                }
              });
            });
          });
        });
      } else {
        cb("invalid", "Undefined usertype");
      }

      // if client fetch all rooms related to request.

      // if broker fetch all rooms related to brokerid.

    } else { cb("invalid", "No usertype"); }
  } else { cb("invalid", "No clientid"); }
}

module.exports = FetchAllRooms;

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
            var splitRoomId = room.split(".");
            var rooms = {
              roomid: room,
              requestid: splitRoomId[1],
              clientid: splitRoomId[2],
              brokerid: splitRoomId[3],
              photo: '',
              fullname: '',
              latestmsg: ''
            }

            db.lrange(room, min, max, function (err, messages) {
              rooms.latestmsg = JSON.parse(messages[0]);
              
              console.log('-----------> userid ', userid);
              console.log('-----------> rooms.clientid ', rooms.clientid);

              if (userid === rooms.clientid) {
                db.hgetall('hm-user.'+rooms.brokerid, function(err, profile) {
                  rooms.photo = profile.photo;
                  rooms.fullname = profile.first_name + " " + profile.last_name;
                  arrayRoom.push(rooms);

                  if(iter === total.length - 1) {
                    cb("success",arrayRoom);
                  }
                });
              } else {
                db.hgetall('hm-user.'+rooms.clientid, function(err, profile) {
                  rooms.photo = profile.photo;
                  rooms.fullname = profile.first_name + " " + profile.last_name;
                  arrayRoom.push(rooms);

                  if(iter === total.length - 1) {
                    cb("success",arrayRoom);
                  }
                });
              }

            });
          });

        });
      } else if (usertype === "CLIENT") {
        db.keys('chatroom.*.'+userid+'.*', function(err, listofrooms){
          // [ 'chatroom.84NKQxFZ.FjVzcosl.15WaQywp' ]
          var arrayRoom = [];
          listofrooms.map(function(room, iter, total){
            var min = 0, max = -1;
            var splitRoomId = room.split(".",2);
            var rooms = {
              roomid: room,
              requestid: splitRoomId[1],
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
      } else { cb("invalid", "Undefined usertype"); }
    } else { cb("invalid", "No usertype"); }
  } else { cb("invalid", "No clientid"); }
}

module.exports = FetchAllRooms;

'use strict'

var Redis = require('ioredis');
var pubRooms = require('../service/pubrooms');
var getRequestDetails = require('../util/getrequestdetails');

function CreateRoom(requestid, clientid, brokerid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  if (clientid) {
    if (brokerid) {
      if (requestid) {

        var chatformat = {
          message: "Hi, I have just the right property for your request",
          from: brokerid,
          type: "text",
          created: Date.now()
        }

        var chatroomid = 'chatroom.' + requestid +"."+ clientid +"."+ brokerid;
        db.keys(chatroomid, function(err, chatroom){
          console.log('chatroom: ', chatroom.length);
          if (chatroom.length === 0) {
            console.log('no existing, create the room.');
            db.lpush('chatroom.' + requestid +"."+ clientid +"."+ brokerid, JSON.stringify(chatformat));

            getRequestDetails(requestid, function(request) {
              var chatroomdetails = {
                chatroomid: chatroomid,
                location: request.area,
                budget: request.budget,
                rentorbuy: request.rentorbuy,
                propertytype: request.ptype,
                addinfo: request.add_info,
              }

                cb("success",chatroomdetails);
                pubRooms(requestid,clientid,brokerid, chatroomdetails);

                //deduct the credits to first message to client.
                db.hgetall('hm-user.'+brokerid, function(err, broker){
                  var deductedcredits = {
                    credits: broker.credits - 1
                  }
                  db.hmset('hm-user.'+brokerid, deductedcredits);
                });
              });
          }else{
            console.log('existing, create the room not valid.');
            cb("invalid","chatroom exist");
          }
        });

      } else { cb("invalid","No requestid"); }
    } else{ cb("invalid", "No brokerid"); }
  } else{ cb("invalid", "No clientid"); }
}

module.exports = CreateRoom;

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
              db.hgetall('hm-user.'+brokerid,function(err, broker) {
                var chatroomdetails = {
                  chatroomid: chatroomid,
                  broker_fullname: broker.first_name + ' ' + broker.last_name,
                  broker_photo: broker.photo,
                  brokerid: broker.id,
                  location: request.area,
                  budget: request.budget,
                  rentorbuy: request.rentorbuy,
                  propertytype: request.ptype,
                  addinfo: request.add_info,
                }
                cb("success",chatroomdetails);
                pubRooms(requestid,clientid,brokerid, chatroomdetails);
              });
            });

              // add to client archive_match
              db.hgetall('hm-user.'+clientid,function(err, clientdata) {
                if(clientdata.id) {
                    if(clientdata.archive_request){
                      var MatchArray = clientdata.archive_request.split(",");
                    }else{
                      var MatchArray = [];
                    }
                    var newArchivedMatch = "hm-req."+requestid;
                    MatchArray.push(newArchivedMatch);
                    db.hmset('hm-user.'+clientid, { archive_match: MatchArray });
                    // cb("You already blocked a request.");
                    console.log('Client added the match to archive_match');
                } else {
                  // cb("Broker id could not find.");
                  console.log("Client id could not find.");
                }
              });

              //deduct the credits to first message to broker.
              db.hgetall('hm-user.'+brokerid, function(err, broker) {
                var deductedcredits = {
                  credits: broker.credits - 1
                }
                db.hmset('hm-user.'+brokerid, deductedcredits);
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

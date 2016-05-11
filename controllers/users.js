'use strict';

var Redis = require('ioredis');
var psubLocation = require('../service/psublocation');
var myaccount = require('../service/myaccount');

function Users(req, cb){
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'brokers_profile': // {"route": { "module":"user", "action": "brokers_profile" } , "payload": { "userid": "z9PS4Kgz", "working_email": "stephelbroker1@gmail.com", "contact_number": "09054866990", "brokerlisc": "12345", "yrexam": "2006", "cover_areas": "Makati,Fort Bonifacio" }}
      console.log('brokers_profile: ');
      // id and details.
      if(req.payload.userid){
        var userid = req.payload.userid;
        var userProfile = {
          working_email: req.payload.working_email,
          contact_number: req.payload.contact_number,
          brokerlisc: req.payload.brokerlisc,
          yrexam: req.payload.yrexam,
          cover_areas: req.payload.cover_areas
        }

        db.hmset("hm-user."+userid, userProfile);
        db.hgetall("hm-user."+userid, function(err, user) {
          cb("success", user);

          // subscribe to a location.
          var areas = user.cover_areas.split(",");
          areas.map(function(area){
            psubLocation(area,function(err, data){
              console.log(data);
            });
          });
        });
      }else{
        cb("incomplete", "Missing broker id");
      }
      break;
    case 'me': // {"route": { "module":"user", "action": "me" } , "payload": { "userid": "userid" }}
        myaccount(req.payload.userid, function(err, data) {
          cb("success", data);
        });
      break;
    default:
  }
}

module.exports = Users;

'use strict'

var Redis = require('ioredis');
var bcrypt = require('bcrypt');
var psubLocation = require('../service/psublocation');
var psubRequest = require('../service/psubrequest');

function ManualLogin(payload, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});
  // validator
  if (payload.email) {
    if (payload.password) {
      // constant variable.
      var email = payload.email;
      var password = payload.password;

      db.get("st-user."+email, function(err, userid) {
        if (userid) {
          db.hgetall("hm-user."+userid, function(err, user) {
            // compare password
            bcrypt.compare(password, user.password, function(err, res) {
              if (res) {
                  if (user.user_type === "CLIENT") {
                    // detect if there is request from this user.
                    db.get("st-req."+user.id, function (err, requestid) {
                      if(requestid){
                        cb("success", { id: userid, message: "User logged in", requestexist: true });

                        //subscribe to your own request.
                        // paramater myid, requestid, callback
                        psubRequest(userid, requestid, function(broadcast){
                          var brkr = JSON.parse(broadcast);
                          var brokerprofile = {
                            brokerid: brkr.id,
                            first_name: brkr.first_name,
                            last_name: brkr.last_name,
                            photo: brkr.photo,
                            liscnum: brkr.brokerlisc,
                            yrexam: brkr.yrexam
                          }
                          cb("broadcast", brokerprofile);
                        });
                      }else{
                        cb("success", { id: id, message: "User logged in", requestexist: false });
                      }
                    });

                  }else{ //BROKER
                    // detect if there is a broker profile.
                    if(user.working_email){
                      cb("success", { id: userid, message: "User logged in", brokerprofile: true });
                    }else{
                      cb("success", { id: userid, message: "User logged in", brokerprofile: false });
                    }

                    // broker subscribe to their own areas.
                    if(user.cover_areas){
                      var areaArray = user.cover_areas.split(",");
                      areaArray.map(function(loc){
                        psubLocation(loc, function(err, broadcast){
                            var request = JSON.parse(broadcast);
                            console.log('manuallogin ----> ', broadcast);
                            cb("broadcast", request);
                        });
                      });
                    }
                  }
              }else{ cb("invalid", "Password did not match"); }
            });
          });
        }else{ cb("invalid", "User does not have account."); }
      });
    }else{ cb("invalid", "Invalid/Empty Password"); }
  }else{ cb("invalid", "Invalid/Empty Email"); }
}

module.exports = ManualLogin;

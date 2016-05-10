'use strict'

var Redis = require('ioredis');
var request = require('request');
var randomstring = require('randomstring');
var psubLocation = require('../service/psublocation');
var psubRequest = require('../service/psubrequest');

function FacebookLogin(payload, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'}),
      tokenid = payload.token,
      profile;

  request.get('https://graph.facebook.com/me?fields=first_name,last_name,email,picture&access_token='+ tokenid, function(err, request, fbinfo) {
    profile = JSON.parse(fbinfo);

    if (profile.error) {
      console.log('error: ', profile.error.message);
      cb("invalid", profile.error.message);
    } else {
      db.get("st-user." + profile.email, function(err, useridexist) {
        if(useridexist) { // Login
          db.hgetall("hm-user."+useridexist, function(err, user) {
            console.log('user: ', JSON.stringify(user));
            cb("success", user);

            if (user.user_type === "BROKER") {
              if(cover_areas) { // subscribe to a location.
                var areas = user.cover_areas.split(",");
                areas.map(function(area) {
                  psubLocation(area, function(err, broadcast) {
                    console.log("success ", broadcast);
                    cb("success", broadcast);
                  });
                });
              }

            } else {
              db.get("st-req."+useridexist, function (err, myrequestid) { // detect if there is request from this user.
                if(myrequestid){
                  cb("success", { id: useridexist, message: "User logged in", requestexist: true });

                  //subscribe to your own request.
                  // paramater myid, requestid, callback
                  psubRequest(useridexist, myrequestid, function(broadcast){
                    var brkr = JSON.parse(broadcast);
                    var brokerprofile = {
                      brokerid: brkr.id,
                      first_name: brkr.first_name,
                      last_name: brkr.last_name,
                      photo: brkr.photo,
                      liscnum: brkr.brokerlisc,
                      yrexam: brkr.yrexam
                    }
                    console.log("broadcast: ", brokerprofile);
                    cb("broadcast", brokerprofile);
                  });
                }else{
                  console.log("success: ", "User logged in and requestexist");
                  cb("success", { id: useridexist, message: "User logged in", requestexist: false });
                }
              });
            }
          });
        }else{ // Signup
          console.log('User does not exist, user will signup.');

          var userProfile = {
            id: randomstring.generate(8),
            member_since: Date.now(),
            email: profile.email,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            photo: profile.picture.data.url || ''
          }

          db.set("st-user."+profile.email, userProfile.id);
          db.hmset("hm-user."+userProfile.id, userProfile);

          //check if registered.
          db.hgetall("hm-user."+userProfile.id, function(err, user) {
            console.log('user: ', JSON.stringify(user));
            cb("success", userProfile);

            //subscribe part after register
            if(user.user_type === "BROKER"){
              // subscribe to a location.
              var areas = user.cover_areas.split(",");
              areas.map(function(area){
                psubLocation(area, function(err, broadcast){
                  cb("success", broadcast);
                });
              });
            }

          });
        }
      });
    }
});
}

module.exports = FacebookLogin;

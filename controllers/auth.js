'use strict';

var Redis = require('ioredis');
var request = require('request');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt');
var psubLocation = require('../service/psublocation');

function Auth(req, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'fblogin':
    var profile;
    request.get('https://graph.facebook.com/me?fields=first_name,last_name,email,picture&access_token='+ req.payload.token, function(err, request, result) {
      profile = JSON.parse(result);
      if(profile.error) {
        console.log('error: ', profile.error.message);
        cb("invalid", profile.error.message);
      } else {

        db.get("st-user."+profile.email, function(err, id){
          console.log('id: ', id);
          if(id){ // Login
            console.log('User exist, user will logged in.');
            db.hgetall("hm-user."+id, function(err, user) {
              console.log('user: ', JSON.stringify(user));
              cb("success", user);

              if (user.user_type === "BROKER") {
                // subscribe to a location.
                if(cover_areas){
                  var areas = user.cover_areas.split(",");
                  areas.map(function(area){
                    psubLocation(area, function(broadcast){
                      cb("success", broadcast);
                    });
                  });
                }
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
                  psubLocation(area, function(result){
                    cb("success", result);
                  });
                });
              }
            });
          }
        });
      }
    });

      break;
    case 'login': // {"route": { "module":"auth", "action": "login" } , "payload": { "email": "broker2@gmail.com", "password": "broker2"}}
        console.log('manual login start');
        if(req.payload.email) {
          if(req.payload.password) {
            db.get("st-user."+req.payload.email, function(err, id){
              if(id){
                db.hgetall("hm-user."+id, function(err, user) {
                  // compare password
                  bcrypt.compare(req.payload.password, user.password, function(err, res) {
                    if(res){

                        if(user.user_type === "CLIENT"){
                          // detect if there is request from this user.
                          db.get("st-req."+user.id, function (err, result) {
                            if(result){
                              cb("success", { id: id, message: "User logged in", requestexist: true });
                            }else{
                              cb("success", { id: id, message: "User logged in", requestexist: false });
                            }
                          });

                        }else{ //BROKER
                          // detect if there is a broker profile.
                          if(user.working_email){
                            cb("success", { id: id, message: "User logged in", brokerprofile: true });
                          }else{
                            cb("success", { id: id, message: "User logged in", brokerprofile: false });
                          }

                          // broker subscribe to their own areas.
                          if(user.cover_areas){
                            var areaArray = user.cover_areas.split(",");
                            areaArray.map(function(loc){
                              psubLocation(loc, function(broadcast){
                                cb("broadcast", broadcast);
                              });
                            });
                          }
                        }
                    }else{
                      cb("invalid", "Password did not match");
                    }
                  });
                });
              }else{
                cb("invalid", "User does not have account.");
              }
            });
          }else{
            cb("invalid", "Invalid/Empty Password");
          }
        }else{
          cb("invalid", "Invalid/Empty Email");
        }

      break;
    case 'signup': // {"route": { "module":"auth", "action": "signup" } , "payload": { "email": "broker2@gmail.com", "first_name": "broker2", "last_name": "broker2", "user_type": "BROKER", "password": "broker2"}}
        console.log('manual signup start');

        if(req.payload.email) {
          if(req.payload.first_name) {
            if(req.payload.last_name) {
              if(req.payload.user_type) {
                if(req.payload.password) {

                var userProfile = {
                  id: randomstring.generate(8),
                  member_since: Date.now(),
                  email: req.payload.email,
                  password: bcrypt.hashSync(req.payload.password, bcrypt.genSaltSync(10)),
                  first_name: req.payload.first_name,
                  last_name: req.payload.last_name || '',
                  user_type: req.payload.user_type || 'CLIENT',
                  photo: ''
                }

                db.get("st-user."+req.payload.email, function(err, id){
                  if(id){
                    cb("invalid", "Account duplicate.");
                  }else{
                    db.set("st-user."+req.payload.email, userProfile.id);
                    db.hmset("hm-user."+userProfile.id, userProfile);
                    cb("success", userProfile);
                  }
                });
                }else{
                  cb("invalid", "Invalid/Empty Password");
                }
              }else{
                cb("invalid", "Invalid/Empty User Type");
              }
            }else{
              cb("invalid", "Invalid/Empty Last Name");
            }
          }else{
            cb("invalid", "Invalid/Empty First Name");
          }
        }else{
          cb("invalid", "Invalid/Empty Email");
        }

      break;
    default:
  }

}

module.exports = Auth;

'use strict';

var Redis = require('ioredis');
var request = require('request');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt');

var facebookLogin = require('../service/facebooklogin');
var manualLogin = require('../service/manuallogin');
var signupemail = require('../util/signupemail');

function Auth(req, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'fblogin':
      facebookLogin(req.payload, function(status,response){
        cb(status, response);
      });
      break;
    case 'login':
      console.log('manual login start');
      manualLogin(req.payload, function(status,response){
        cb(status, response);
      });
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
                  user_type: req.payload.user_type,
                  archive_request: [],
                  archive_match: [],
                  subscribed_rooms: [],
                  photo: '',
                  credits: 50
                }

                db.get("st-user."+req.payload.email, function(err, id){
                  if(id){
                    cb("invalid", "Account duplicate.");
                  }else{
                    db.set("st-user."+req.payload.email, userProfile.id);
                    db.hmset("hm-user."+userProfile.id, userProfile);
                    cb("success", userProfile);
                    signupemail(userProfile.email, userProfile.user_type);
                  }
                });

                }else{ cb("invalid", "Invalid/Empty Password"); }
              }else{ cb("invalid", "Invalid/Empty User Type"); }
            }else{ cb("invalid", "Invalid/Empty Last Name"); }
          }else{ cb("invalid", "Invalid/Empty First Name"); }
        }else{ cb("invalid", "Invalid/Empty Email"); }

      break;
    default:
  }

}

module.exports = Auth;

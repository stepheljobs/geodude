'use strict';

var Redis = require('ioredis');
var socket = require('./../socket');
var request = require('request');
var randomstring = require('randomstring');
var bcrypt = require('bcrypt');


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
            cb("success",userProfile);
          }
        });
      }
    });

      break;
    case 'login':

    

      break;
    case 'signup':
        console.log('');
        var userProfile = {
          id: randomstring.generate(8),
          member_since: Date.now(),
          email: req.payload.email,
          first_name: req.payload.first_name,
          last_name: req.payload.last_name || '',
          photo: ''
        }

        db.set(req.payload.email, userProfile.id);
        db.hmset(userProfile.id, userProfile);
        cb("success",userProfile);
      break;
    default:
  }

}

module.exports = Auth;

'use strict';

var request = require('request');
var socket = require('./socket');

var authController = require('./controllers/auth');
var requestController = require('./controllers/request');
var userController = require('./controllers/users');
var matchController = require('./controllers/match');
var chatController = require('./controllers/chat');
var pushNotifController = require('./controllers/pnotif');

function Socket(conn) {
  if (!conn) {
    return;
  }

  if (!(this instanceof Socket)) {
    return new Socket(conn);
  }

  conn.on('data', function(message) {
      console.log('message: ', message);

      try {
        var req = JSON.parse(message);

        switch (req.route.module) {
          case "auth":
            authController(req, function(status,data){
              if (status === "broadcast") {
                var bcast = { "broadcast" : { route: {"module": "auth", "action": "broadcast" }, "payload": JSON.parse(data) } }
                conn.write(JSON.stringify(bcast));
              }else{
                var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                console.log('response: ', JSON.stringify(response));
                conn.write(JSON.stringify(response));
              }
            });
            break;
            case "request":
              requestController(req, function(status,data){
                if (status === "broadcast") {
                  var bcast = { "broadcast" : { route: {"module": "request", "action": "broadcast" }, "payload": JSON.parse(data) } }
                  conn.write(JSON.stringify(bcast));
                  console.log('req - broadcast: ', JSON.stringify(bcast));
                }else{
                  var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                  console.log('response: ', JSON.stringify(response));
                  conn.write(JSON.stringify(response));
                }
              });
              break;
            case "user":
              userController(req, function(status,data){
                if (status === "broadcast") {
                  var bcast = { "broadcast" : { route: {"module": "user", "action": "broadcast" }, "payload": JSON.parse(data) } }
                  conn.write(JSON.stringify(bcast));
                  console.log('user - broadcast: ', JSON.stringify(bcast));
                }else{
                  var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                  console.log('response: ', JSON.stringify(response));
                  conn.write(JSON.stringify(response));
                }
              });
              break;
            case "match":
              matchController(req, function(status,data){
                if (status === "broadcast") {
                  var bcast = { "broadcast" : { route: {"module": "match", "action": "broadcast" }, "payload": JSON.parse(data) } }
                  conn.write(JSON.stringify(bcast));
                  console.log('match - broadcast: ', bcast);
                }else{
                  var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                  console.log('response: ', JSON.stringify(response));
                  conn.write(JSON.stringify(response));
                }
              });
              break;
            case "chat":
              chatController(req, function(status,data){
                if (status === "broadcast") {
                  var bcast = { "broadcast" : { route: {"module": "chat", "action": "broadcast" }, "payload": JSON.parse(data) } }
                  conn.write(JSON.stringify(bcast));
                  console.log('chat - broadcast: ', bcast);
                }else{
                  var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                  console.log('response: ', JSON.stringify(response));
                  conn.write(JSON.stringify(response));
                }
              });
              break;
            case "pushnotif":
              pushNotifController(req, function(status,data){
                if (status === "broadcast") {
                  var bcast = { "broadcast" : { route: {"module": "chat", "action": "broadcast" }, "payload": JSON.parse(data) } }
                  conn.write(JSON.stringify(bcast));
                  console.log('match - broadcast: ', bcast);
                }else{
                  var response = { "response" : { "code": status, route: {"module": req.route.module, "action": req.route.action }, "payload": data } }
                  console.log('response: ', JSON.stringify(response));
                  conn.write(JSON.stringify(response));
                }
              });
              break;
          default:
        }
      } catch(err) {
        console.log("err: ", err);
        var err = { "response" : { "code": "error", "payload": "Invalid format" }}
        conn.write(JSON.stringify(err));
      }

  });

  conn.on('close', function() {});

}

module.exports = Socket;

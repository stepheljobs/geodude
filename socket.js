'use strict';

var request = require('request');
var socket = require('./socket');

var authController = require('./controllers/auth');

function Socket(conn) {
  if (!conn) {
    return;
  }

  if (!(this instanceof Socket)) {
    return new Socket(conn);
  }

  conn.on('data', function(message) {
      console.log('message: ', message);
      var req = JSON.parse(message);

      switch (req.route.module) {
        case "auth":
          authController(req, function(status,data){
            var response = { "response" : { "code": status, "payload": data } }
            conn.write(JSON.stringify(response));
          });
          break;
        default:
      }

  });

  conn.on('close', function() {});

}

module.exports = Socket;

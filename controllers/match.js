'use strict';

var Redis = require('ioredis');
var pubRequest = require('../service/pubrequest');
var fetchAllMatch = require('../service/fetchallmatch');

function Match(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'haveit':
        pubRequest(req.payload, function(err, result){
          if (result) {
            cb("success", result);
          } else {
            cb("error", "No response.");
          }
        });
      break;
    case 'fetchallmatch':
        fetchAllMatch(req.payload.clientid, function(result){
          if (result) {
            cb("success", result);
          } else {
            cb("error", "No response.");
          }
        });
      break;
    default:
  }
}

module.exports = Match;

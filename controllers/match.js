'use strict';

var Redis = require('ioredis');
var pubRequest = require('../service/pubrequest');
var rejectClient = require('../service/rejectclient');

function Match(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'haveit':
        pubRequest(req.payload, function(err, result){
          if(result){
            cb("success", result);
          }else{
            cb("error", "No response.");
          }
        });
      break;
    case 'rejectrequest': //use by broker only

    if (req.payload.brokerid) {
      if (req.payload.requestid) {
        rejectClient(req.payload, function(result) {
          console.log('----> ', result);
          if(result){
            cb("success", result);
          }else{
            cb("error", "No response.");
          }
        });
      } else { cb("error", "No Requestid."); }
    } else { cb("error", "No Brokerid."); }

      break;
    default:
  }
}

module.exports = Match;

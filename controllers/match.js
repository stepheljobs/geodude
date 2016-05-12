'use strict';

var Redis = require('ioredis');
var pubRequest = require('../service/pubrequest');
var rejectClient = require('../service/rejectclient');
var fetchAllMatch = require('../service/fetchallmatch');

function Match(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'haveit':
        var clientid = req.payload.clientid,
            requestid = req.payload.requestid,
            brokerid = req.payload.brokerid;

        if(clientid){
          if(brokerid){
            if(requestid){

              pubRequest(req.payload, function(status, result){
                console.log('match --------------> ', result);
                if(result){
                  cb(status, result);
                }else{
                  cb('invalid', 'no result');
                }
              });

            }else{ cb('invalid', 'no requestid'); }
          }else{ cb('invalid', 'no brokerid'); }
        }else{ cb('invalid', 'no clientid'); }
      break;
    case 'rejectrequest': //use by broker only
    if (req.payload.brokerid) {
      if (req.payload.requestid) {
        rejectClient(req.payload, function(result) {
          if(result){
            cb("success", result);
          }else{
            cb("error", "No response.");
          }
        });
      } else { cb("error", "No Requestid."); }
    } else { cb("error", "No Brokerid."); }
      break;
    case 'fetchallmatch':
        fetchAllMatch(req.payload.clientid, function(err, result){
          if (result) {
            console.log('fetchAllMatch: ', result);
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

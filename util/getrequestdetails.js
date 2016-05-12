'use strict'
var Redis = require('ioredis');

function getRequestDetails(requestid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if(requestid){
    db.hgetall('hm-req.'+requestid, function(err, reqdetails){
      cb(reqdetails);
    })
  }else {
    console.log('getRequestDetails: no requestid');
  }
}

module.exports = getRequestDetails;

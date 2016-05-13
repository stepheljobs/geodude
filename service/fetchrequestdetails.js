'use strict'

var Redis = require('ioredis');

function FetchRequestDetails(requestid, cb) {
  var db = new Redis({port: 6379, host: '127.0.0.1'});

  if(requestid){
    db.hgetall('hm-req.'+requestid, function(err, reqdetails){
      console.log('request details fetched: ', reqdetails);
      cb('success', reqdetails);
    });
  }

}

module.exports = FetchRequestDetails;

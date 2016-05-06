'use strict'

var Redis = require('ioredis');

function FetchAllRequest(cover_areas, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var sortedRequest = [];
  db.keys('hm-req.*', function(err, requests){
    requests.map(function(singleRequest) {
      db.hgetall(singleRequest, function(err, requestDetail) {

        var area = cover_areas.split(",");
        area.map(function(ca){
          if(requestDetail.area.includes(ca)){
            console.log("match cover area: ", requestDetail);
            sortedRequest.push(requestDetail);
          }
        });
      })
    });

    setTimeout(function(){
      cb(null,sortedRequest);
    }, 3000);

  })
}

module.exports = FetchAllRequest;

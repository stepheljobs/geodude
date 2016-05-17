'use strict'

var Redis = require('ioredis');

function FetchAllRequest(blockrequest,cover_areas, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var sortedRequest = [];
  db.keys('hm-req.????????', function(err, requests) {

    requests.map(function(singleRequest, iter, total) {

      if (blockrequest) {
        if(!blockrequest.includes(singleRequest)){
          db.hgetall(singleRequest, function(err, requestDetail) {
            var area = cover_areas.split(",");
            area.map(function(ca) {
              if(requestDetail.area.includes(ca)) {
                console.log("match cover area: ", requestDetail);
                sortedRequest.push(requestDetail);

                if(iter === total.length - 1){
                  console.log('');
                  cb(null,sortedRequest);
                }
              }
            });
          });
        } else {
          console.log("a request is blocked already by the broker: ", singleRequest);
        }

      } else {
        db.hgetall(singleRequest, function(err, requestDetail) {
          var area = cover_areas.split(",");
          area.map(function(ca) {
            if(requestDetail.area.includes(ca)) {
              console.log("match cover area: ", requestDetail);
              sortedRequest.push(requestDetail);

              if(iter === total.length - 1){
                console.log('');
                cb(null,sortedRequest);
              }
            }
          });
        });
      }
    });
  });
}

module.exports = FetchAllRequest;

'use strict'

var Redis = require('ioredis');

function FetchAllRequest(archive_request,cover_areas, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var sortedRequest = [];
  db.keys('hm-req.????????', function(err, requests) {

    requests.map(function(singleRequest, iter, total) {

      if (archive_request) {
        if(!archive_request.includes(singleRequest)){
          db.hgetall(singleRequest, function(err, requestDetail) {
            var area = cover_areas.split(",");
            area.map(function(ca) {
              if(requestDetail.area.includes(ca)) {
                console.log("1 match cover area: ", requestDetail);
                sortedRequest.push(requestDetail);

                setTimeout(function(){
                  cb(null,sortedRequest);
                }, 2000);
                // if(iter === total.length - 1){
                //   cb(null,sortedRequest);
                // }
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
              console.log("2 match cover area: ", requestDetail);
              sortedRequest.push(requestDetail);

              setTimeout(function(){
                cb(null,sortedRequest);
              }, 2000);
              // if(iter === total.length - 1){
              //   cb(null,sortedRequest);
              // }
            }
          });
        });
      }
    });
  });
}

module.exports = FetchAllRequest;

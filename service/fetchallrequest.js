'use strict'

var Redis = require('ioredis');
var async = require("async");
var lazy = require("lazy.js");

function FetchAllRequest(payload, cb) {

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var brokerid = payload.brokerid;
  var sortedRequest, broker_cover_areas, broker_archive_req, allrequest;
  var finalList = [];

  async.series({
      one: function(callback) {
        db.hgetall("hm-user."+brokerid, function(err, data) {

          if(data.archive_request) {
            broker_archive_req = data.archive_request;
          }

          if(data.cover_areas) {
            broker_cover_areas = data.cover_areas;
            console.log('---> broker_cover_areas: ', broker_cover_areas);
            setTimeout(function(){
              callback(null, 1);
            },100);
          }else{
            cb("invalid", { message: "No cover areas" });
          }
        });
      },
      two: function(callback) {
        db.keys('hm-req.????????', function(err, requestlist) {
          allrequest = requestlist;
          console.log('---> allrequest: ', allrequest);
          setTimeout(function(){
            callback(null, 1);
          },100);
        });
      },
      three: function(callback) {
        sortedRequest = lazy(allrequest).without(broker_archive_req).value();
        console.log('---> sortedRequest: ', sortedRequest);
        setTimeout(function(){
          callback(null, 1);
        },100);
      },
      fourth: function(callback) {
        console.log('---> sortedRequest2: ', sortedRequest);
        sortedRequest.map(function(n, i, t){
          db.hgetall(n, function(err, reqdetail){
            var bca = lazy(broker_cover_areas).split(",").value();

            async.series({
              matchingarea: function(cback) {
                bca.map(function(ca) {
                  if(reqdetail.area.includes(ca)) {
                    console.log("match: ", reqdetail);
                    finalList.push(reqdetail);
                  }
                  setTimeout(function(){
                    cback(null, 1);
                  },100);
                });
              },
              checkiteration: function(cback) {
                if(i === t.length -1) {
                  setTimeout(function() {
                    callback(null, 1); //end of fourth series.
                  },100);
                }
              }
            }); //end of async
          }); // end of db hgetall
        }); // emd of mapping
      },
      fifth: function(callback) {
        console.log('---> finalList: ', finalList);
        cb("success",finalList);
      }
  }); //end of async

  // db.keys('hm-req.????????', function(err, requests) {
  //
  //   requests.map(function(singleRequest, iter, total) {
  //
  //     if (archive_request) {
  //       if(!archive_request.includes(singleRequest)){
  //         db.hgetall(singleRequest, function(err, requestDetail) {
  //           var area = cover_areas.split(",");
  //           area.map(function(ca) {
  //             if(requestDetail.area.includes(ca)) {
  //               console.log("1 match cover area: ", requestDetail);
  //               sortedRequest.push(requestDetail);
  //
  //               setTimeout(function(){
  //                 cb(null,sortedRequest);
  //               }, 2000);
  //               // if(iter === total.length - 1){
  //               //   cb(null,sortedRequest);
  //               // }
  //             }
  //           });
  //         });
  //       } else {
  //         console.log("a request is blocked already by the broker: ", singleRequest);
  //       }
  //     } else {
  //       db.hgetall(singleRequest, function(err, requestDetail) {
  //         var area = cover_areas.split(",");
  //         area.map(function(ca) {
  //           if(requestDetail.area.includes(ca)) {
  //             console.log("2 match cover area: ", requestDetail);
  //             sortedRequest.push(requestDetail);
  //
  //             setTimeout(function(){
  //               cb(null,sortedRequest);
  //             }, 2000);
  //             // if(iter === total.length - 1){
  //             //   cb(null,sortedRequest);
  //             // }
  //           }
  //         });
  //       });
  //     }
  //   });
  // });
}

module.exports = FetchAllRequest;

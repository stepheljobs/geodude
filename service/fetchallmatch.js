'use strict'

var Redis = require('ioredis');
var async = require("async");
var _ = require("underscore");

function FetchAllMatch(clientid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var archivedMatch, listofMatch, newList;
  var requestId, finalList = [];

  async.series({
      one: function(callback){
        db.get("st-req."+clientid, function(err, requestid){
          requestId = requestid;
          // console.log('requestid -----> fetching all match... > requestid', requestId);
          setTimeout(function(){
            callback(null, 1);
          },100);
        });
      },
      two: function(callback){
        console.log(' >>>> requestId: ', requestId);
        db.keys('hm-match.'+requestId+'.*', function(err, arrayofmatch) {
          listofMatch = arrayofmatch;
          // console.log('listofMatch -----> fetching all match... > listofMatch', listofMatch);
          setTimeout(function(){
            callback(null, 1);
          },100);
        });
      },
      three: function(callback){
        db.hgetall('hm-user.'+clientid, function(err, clientdata) {
          archivedMatch = clientdata.archive_match;
          // console.log('archivedMatch -----> fetching all match... > archivedMatch', clientdata.archive_match);
          setTimeout(function(){
            callback(null, 1);
          },100);
        });
      },
      four: function(callback){
        newList = _.difference(listofMatch, archivedMatch);
        // console.log('underscore -----> fetching all match... > newList', newList);
        setTimeout(function(){
          callback(null, 1);
        },100);
      },
      five: function(callback){
        var totalarray = newList.length;
        var n = 0;
        console.log('>',totalarray);

        if(totalarray != 0) {
          _.map(newList, function(singleMatch) {
            db.hgetall(singleMatch, function(err, matchDetail) {
              console.log('matchDetail: ', matchDetail);
              finalList.push(matchDetail);

              console.log('n: ', n);
              console.log('totalarray: ', totalarray -1);
              if(n === totalarray -1) {
                // console.log('result -----> fetching all match... > finalList', finalList);
                cb(null,finalList);
              } else {
                n++;
              }
            });
          });
        } else {
          cb(null,"No match is fetch");
        }

      }
  });

  // var sortedMatch = [];
  // if (clientid) {
  //   db.get("st-req."+clientid, function(err, requestid){
  //     db.keys('hm-match.'+requestid+'.*', function(err, listofmatch) {
  //       console.log(listofmatch);
  //       listofmatch.map(function(singleMatch) {
  //         db.hgetall(singleMatch, function(err, matchDetail) {
  //           console.log('matchDetail: ', matchDetail);
  //           sortedMatch.push(matchDetail);
  //         });
  //       });
  //     });
  //
  //     setTimeout(function() {
  //       cb(null,sortedMatch);
  //     }, 3000);
  //   });
  // }else{
  //   cb(null,"No client Id");
  // }

}

module.exports = FetchAllMatch;

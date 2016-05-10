'use strict'

var Redis = require('ioredis');

function FetchAllMatch(clientid, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var sortedMatch = [];
  if (clientid) {
    db.get("st-req."+clientid, function(err, requestid){
      db.keys('hm-match.'+requestid+'.*', function(err, listofmatch){
        console.log(listofmatch);
        listofmatch.map(function(singleMatch) {
          db.hgetall(singleMatch, function(err, matchDetail) {
            console.log('matchDetail: ', matchDetail);
            sortedMatch.push(matchDetail);
          });
        });
      });

      setTimeout(function(){
        cb(null,sortedMatch);
      }, 3000);
    });
  }else{
    cb(null,"No client Id");
  }

}

module.exports = FetchAllMatch;

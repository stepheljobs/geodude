'use strict'

var Redis = require('ioredis');

function PubLocation(reqid, location, requestdetails, cb) {
  console.log('----------> send a broadcast to location: ', location);
  var pub = new Redis({port: 6379,host: '127.0.0.1'});

  var areaArray = location.split(",");
  areaArray.map(function(area){
      pub.publish(reqid+"."+area, JSON.stringify(requestdetails));
  });

  // callback for total count of match brokers
  var count = 0;
  pub.keys('hm-user.*', function(err, listofusers) {
    listofusers.map(function(user, iter, total) {
      pub.hgetall(user, function(err, details) {
        if(details.cover_areas) {
          var regexString = details.cover_areas.replace(",", "|");
          var regex = new RegExp(regexString);
          var isMatch = location.match(regex);
            if(isMatch) {
                count++;
            }
        }

        if(iter === total.length - 1) {
          cb(count);
        }
      });
    });
  });

}

module.exports = PubLocation;

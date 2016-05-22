'use strict'

var Redis = require('ioredis');
var sendPushNotif = require('../service/sendpushnotif');

function PubLocation(reqid, location, requestdetails, cb) {

  var pub = new Redis({port: 6379,host: '127.0.0.1'});

  var areaArray = location.split(",");
  areaArray.map(function(area) {
      var startswithSpace = area.startsWith(" ");
      if(startswithSpace) {
        area = area.replace(" ", "");
      }
      pub.publish(reqid+"."+area, JSON.stringify(requestdetails));
  });

  // callback for total count of match brokers
  var count = 0;
  var brokerList = []
  pub.keys('hm-user.*', function(err, listofusers) {
    listofusers.map(function(user, iter, total) {
      pub.hgetall(user, function(err, details) {
        if(details.cover_areas) {
          var regexString = details.cover_areas.replace(/,/g, "|");;
          var regex = new RegExp(regexString);
          var isMatch = location.match(regex);
            if(isMatch) {
                brokerList.push(details.id);
                count++;
            }
        }

        if(iter === total.length - 1) {
          cb(count);
          sendPushNotif(brokerList);
        }
      });
    });
  });

}

module.exports = PubLocation;

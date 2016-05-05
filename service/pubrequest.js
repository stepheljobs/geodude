'use strict'

var Redis = require('ioredis');

function PubRequest(data) {
  var pub = new Redis({port: 6379,host: '127.0.0.1'});
  var clientid = data.userid;
  var requestid = data.requestid;
  // console.log("==? ", );
  pub.hgetall("hm-user."+data.userid, function(err, brokerprofile) {
    console.log('a Broker with id: ', data.userid, 'says i have it to request id: ', data.requestid);
   pub.publish(clientid+"."+requestid, JSON.stringify(brokerprofile));
  });
}

module.exports = PubRequest;

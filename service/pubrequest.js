'use strict'

var Redis = require('ioredis');

function PubRequest(data, cb) {
  var pub = new Redis({port: 6379,host: '127.0.0.1'});
  var clientid = data.clientid;
  var requestid = data.requestid;
  var brokerid = data.brokerid;
  pub.hgetall("hm-user."+brokerid, function(err, brokerprofile) {
   console.log('a broker says i have it to request id: ', requestid);
   pub.publish(clientid+"."+requestid, JSON.stringify(brokerprofile)); //broadcast to client
   cb(null, "I have it sent to client.");
  });
}

module.exports = PubRequest;

'use strict'

var Redis = require('ioredis');
var randomstring = require('randomstring');

function AcceptRequest(data, cb) {

    var redis = new Redis({ port: 6379, host: '127.0.0.1'});
    var clientid = data.clientid;
    var requestid = data.requestid;
    var brokerid = data.brokerid;
    redis.hgetall("hm-user."+brokerid, function(err, brokerprofile) {
      console.log('A broker says i have it to request id: ', requestid);

      var matchdata = {
        matchid: requestid+"."+brokerid,
        requestid: requestid,
        brokerid: brokerid,
        photo: brokerprofile.photo,
        firstname: brokerprofile.first_name,
        lastname: brokerprofile.last_name,
        brokerlisc: brokerprofile.brokerlisc,
        yrexam: brokerprofile.yrexam,
        matchcreated: Date.now()
      }

      redis.hmset("hm-match."+requestid+"."+brokerid, matchdata);
      redis.publish(clientid+"."+requestid, JSON.stringify(matchdata));
      cb("success", "I have it sent to client.");
    });
}

module.exports = AcceptRequest;

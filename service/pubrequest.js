'use strict'

var Redis = require('ioredis');
var randomstring = require('randomstring');
var psubrooms = require('../service/psubrooms');

function PubRequest(data, cb) {

    var pub = new Redis({ port: 6379, host: '127.0.0.1'});
    var clientid = data.clientid;
    var requestid = data.requestid;
    var brokerid = data.brokerid;
    pub.hgetall("hm-user."+brokerid, function(err, brokerprofile) {
    console.log('a broker says i have it to request id: ', requestid);

    var matchdata = {
      matchid: requestid+"."+brokerid,
      brokerid: brokerid,
      photo: brokerprofile.photo,
      firstname: brokerprofile.first_name,
      lastname: brokerprofile.last_name,
      brokerlisc: brokerprofile.brokerlisc,
      yrexam: brokerprofile.yrexam,
      matchcreated: Date.now()
    }

    pub.hmset("hm-match."+requestid+"."+brokerid, matchdata);
    // broker will now subscribe to the room channel when the click I have it.
    psubrooms(requestid,clientid,brokerid, function(result){
        cb("broadcast", result);
    });
    pub.publish(clientid+"."+requestid, JSON.stringify(brokerprofile)); //broadcast to client
    cb("success", "I have it sent to client.");

  });
}

module.exports = PubRequest;

'use strict'

var Redis = require('ioredis');
var randomstring = require('randomstring');
var sendMatchEmail = require('../util/sendmatchemail');
var matchpushnotif = require('../service/matchpushnotif');
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
      matchpushnotif(clientid);
      cb("success", "I have it sent to client.");

      // add the request to archive_request
      if(brokerprofile.archive_request){
        var BlockReqArray = brokerprofile.archive_request.split(",");
      }else{
        var BlockReqArray = [];
      }
      var newBlockReq = "hm-req."+requestid;
      BlockReqArray.push(newBlockReq);
      redis.hmset('hm-user.'+brokerid, { archive_request: BlockReqArray });

      // email the client about the broker matched.
      redis.hgetall("hm-user."+clientid, function(err, clientprofile) {
        sendMatchEmail(clientprofile.email);
      });

    });


}

module.exports = AcceptRequest;

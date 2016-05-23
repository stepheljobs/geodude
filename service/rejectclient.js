'use strict'

var Redis = require('ioredis');

function RejectClient(payload, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var brokerid = payload.brokerid;
  var requestid = payload.requestid;

  db.hgetall('hm-user.'+brokerid,function(err, brokerdata){
    if(brokerdata.id){
        if(brokerdata.archive_request){
          var BlockReqArray = brokerdata.archive_request.split(",");
        }else{
          var BlockReqArray = [];
        }

        var newBlockReq = "hm-req."+requestid;
        BlockReqArray.push(newBlockReq);

        db.hmset('hm-user.'+brokerid, { archive_request: BlockReqArray });
        cb("You already blocked a request.");
    } else {
      cb("Broker id could not find.");
      console.log("Broker id could not find.");
    }

  });
}

module.exports = RejectClient;

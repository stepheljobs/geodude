'use strict'

var Redis = require('ioredis');

function RejectClient(payload, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var brokerid = payload.brokerid;
  var requestid = payload.requestid;

  db.hgetall('hm-user.'+brokerid,function(err, brokerdata){
    // {"id":"15WaQywp","member_since":"1462807370500","email":"broker2@gmail.com","password":"$2a$10$thnVaZnFLRXruvfIajjrx.PL4YRjnazAGm3F6gT9WNp9aL6J9Trvi","first_name":"broker2","last_name":"broker2","user_type":"BROKER","photo":"","working_email":"sbroker2@gmail.com","contact_number":"09054866990","brokerlisc":"12345","yrexam":"2006","cover_areas":"Paranaque"}

    if(brokerdata.id){

        if(brokerdata.blockrequest){
          var BlockReqArray = brokerdata.blockrequest.split(",");
        }else{
          var BlockReqArray = [];
        }

        var newBlockReq = "hm-req."+requestid;
        BlockReqArray.push(newBlockReq);

        db.hmset('hm-user.'+brokerid, { blockrequest: BlockReqArray });
        cb("You already blocked a request.");
    } else {
      cb("Broker id could not find.");
      console.log("Broker id could not find.");
    }

  });
}

module.exports = RejectClient;

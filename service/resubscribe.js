'use strict'

function ReSubscribe(payload, cb) {
  var Redis         = require('ioredis'),
      db            = new Redis({port: 6379, host: '127.0.0.1'}),
      psubLocation  = require('../service/psublocation'),
      psubRequest   = require('../service/psubrequest');

  if (payload.userid) {
    if(payload.user_type){

      var userid    = payload.userid,
          user_type = payload.user_type;

      if (user_type === "BROKER") {
        db.hgetall('hm-user.'+userid, function(err, broker) {
          if (broker.cover_areas) {
              var areaArray = broker.cover_areas.split(",");
                  areaArray.map(function(loc) {
                  psubLocation(loc, function(err, broadcast){
                    cb("broadcast", broadcast);
                  });
              });
            cb("success", "User is resubscribe again.");
          }
        });
      }

      if (user_type === "CLIENT") {
        db.get('st-req.'+userid, function(err, result) {
          var requestid = result,
              clientid  = userid;
          psubRequest(clientid, requestid, function(result){
            cb("broadcast", result);
          });
          cb("success", "User is resubscribe again.");
        });
      }

    } else { cb('incomplete', 'no User Type.'); }
  } else { cb('incomplete', 'no User Id.'); }

}

module.exports = ReSubscribe;

'use strict'

var Redis = require('ioredis');

function RejectMatch(payload, cb) {

  var db = new Redis({port: 6379, host: '127.0.0.1'});
  var clientid = payload.clientid;
  var matchid = payload.matchid;

  db.hgetall('hm-user.'+clientid,function(err, clientdata) {
    if(clientdata.id){
        if(clientdata.archive_match) {
          var BlockMatchArray = clientdata.archive_match.split(",");
        } else {
          var BlockMatchArray = [];
        }

        var newBlockMatch = "hm-match."+matchid;
        BlockMatchArray.push(newBlockMatch);

        db.hmset('hm-user.'+ clientid, { archive_match: BlockMatchArray });
        cb("success", "You now blocked a match.");

        var message = "A clientid: " + clientid + " blocked a matchid: " + newBlockMatch;
        console.log(message);
    } else {
      console.log("Client id could not find.");
      cb("incomplete", "Client id could not find.");
    }
  });
}

module.exports = RejectMatch;

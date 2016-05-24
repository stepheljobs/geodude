'use strict';

var Redis = require('ioredis');

const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var SNS = require('sns-mobile'),
    EVENTS = SNS.EVENTS;

var SNS_KEY_ID = process.env.SNS_KEY_ID,
  SNS_ACCESS_KEY = process.env.SNS_ACCESS_KEY,
  IOS_BROKER_ARN = process.env.SNS_IOS_BROKER_ARN,
  IOS_CLIENT_ARN = process.env.SNS_IOS_CLIENT_ARN;

function SendMsgPNotif(chatformat, roomid){ //ARRAY
  // var chatformat = { message: message, from: userid, type: type, created: Date.now() }

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var userId = chatformat.from;
  db.hgetall('hm-user.'+userId, function(err, user) {

    if(user.user_type === 'BROKER') {
      // if client. set the broker arn
      var iosApp = new SNS({
        platform: SNS.SUPPORTED_PLATFORMS.IOS,
        region: 'ap-southeast-1',
        apiVersion: '2012-10-17',
        accessKeyId: SNS_ACCESS_KEY,
        secretAccessKey: SNS_KEY_ID,
        platformApplicationArn: IOS_CLIENT_ARN,
        sandbox: true
      });

      //then send to client the message.
      var temp = roomid.split('.');
      var clientId = temp[2];

      db.hgetall('hm-user.'+clientId, function(err, userdata){
        if(userdata.endpointArn) {
          iosApp.sendMessage(user.endpointArn, 'A broker send you a message.', function(err, messageId) {
            if(err) { throw err; }
            console.log('Request Message sent, ID was: ' + messageId);
          });
        }else{
          console.log('No available endpointArn');
        }
      });

    } else {
      // if client. set the broker arn
      var iosApp = new SNS({
        platform: SNS.SUPPORTED_PLATFORMS.IOS,
        region: 'ap-southeast-1',
        apiVersion: '2012-10-17',
        accessKeyId: SNS_ACCESS_KEY,
        secretAccessKey: SNS_KEY_ID,
        platformApplicationArn: IOS_BROKER_ARN,
        sandbox: true
      });

      //then send to client the message.
      var temp = roomid.split('.');
      var brokerId = temp[3];

      db.hgetall('hm-user.'+brokerId, function(err, userdata){
        if(userdata.endpointArn) {
          iosApp.sendMessage(user.endpointArn, 'A client send you a message.', function(err, messageId) {
            if(err) { throw err; }
            console.log('Request Message sent, ID was: ' + messageId);
          });
        }else{
          console.log('No available endpointArn');
        }
      });
    }

  });

}

module.exports = SendMsgPNotif;

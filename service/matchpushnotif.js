'use strict';

var Redis = require('ioredis');

const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var SNS = require('sns-mobile'),
    EVENTS = SNS.EVENTS;

function MatchPushNotif(clientid){

  var SNS_KEY_ID = process.env.SNS_KEY_ID,
    SNS_ACCESS_KEY = process.env.SNS_ACCESS_KEY,
    IOS_BROKER_ARN = process.env.SNS_IOS_BROKER_ARN,
    IOS_CLIENT_ARN = process.env.SNS_IOS_CLIENT_ARN;

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var iosApp = new SNS({
    platform: SNS.SUPPORTED_PLATFORMS.IOS,
    region: 'ap-southeast-1',
    apiVersion: '2010-03-31',
    accessKeyId: SNS_ACCESS_KEY,
    secretAccessKey: SNS_KEY_ID,
    platformApplicationArn: IOS_CLIENT_ARN,
    sandbox: true
  });

  // Send a simple String or data to the client
  db.hgetall('hm-user.'+clientid, function(err, user){
    if(user.endpointArn) {
      iosApp.sendMessage(user.endpointArn, 'A broker matches your request.', function(err, messageId) {
        if(err) { throw err; }
        console.log('Request Message sent, ID was: ' + messageId);
      });
    }else{
      console.log('No available endpointArn');
    }
  });

}

module.exports = MatchPushNotif;

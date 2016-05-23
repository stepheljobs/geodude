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

function SendPushNotif(brokerList){ //ARRAY

  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var iosApp = new SNS({
    platform: SNS.SUPPORTED_PLATFORMS.IOS,
    region: 'ap-southeast-1',
    apiVersion: '2012-10-17',
    accessKeyId: SNS_ACCESS_KEY,
    secretAccessKey: SNS_KEY_ID,
    platformApplicationArn: IOS_BROKER_ARN,
    sandbox: true
  });

  // Send a simple String or data to the client
  brokerList.map(function(brokerid, iter, total) {
    db.hgetall('hm-user.'+brokerid, function(err, user) {
      if(user.endpointArn) {
        iosApp.sendMessage(user.endpointArn, 'A client request matches your listings.', function(err, messageId) {
          if(err) { throw err; }
          console.log('Request Message sent, ID was: ' + messageId);
        });
      }else{
        console.log('No available endpointArn');
      }
    });
  });

}

module.exports = SendPushNotif;

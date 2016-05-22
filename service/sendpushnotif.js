'use strict';

var Redis = require('ioredis');

const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var SNS = require('sns-mobile'),
    EVENTS = SNS.EVENTS;

var SNS_KEY_ID = process.env.SNS_KEY_ID,
  SNS_ACCESS_KEY = process.env.SNS_ACCESS_KEY,
  IOS_BROKER_ARN = process.env.SNS_IOS_BROKER_ARN

function SendPushNotif(payload, cb){ //0bbce83aab7742398355b0deb1790039643697da8944b8c9da82c6ed82449d41
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

  var deviceId = payload.deviceToken;

  // Add a user, the endpointArn is their unique id
  // endpointArn is required to send messages to the device
  iosApp.addUser(deviceId, JSON.stringify({
    some: 'extra data'
  }), function(err, endpointArn) {
    console.log('-----> ', endpointArn);
    if(err) { throw err; }

    // Send a simple String or data to the client
    iosApp.sendMessage(endpointArn, 'Hi There!', function(err, messageId) {
      if(err) { throw err; }
      console.log('Message sent, ID was: ' + messageId);
    });
  });

}

module.exports = SendPushNotif;

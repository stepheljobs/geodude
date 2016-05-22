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

function SaveToken(payload, cb){ //0bbce83aab7742398355b0deb1790039643697da8944b8c9da82c6ed82449d41
  var db = new Redis({port: 6379,host: '127.0.0.1'});
  var deviceId = payload.deviceToken;
  var userType = payload.user_type;
  var userId = payload.userid;

  if(userType === "BROKER") {
    var iosApp = new SNS({
      platform: SNS.SUPPORTED_PLATFORMS.IOS,
      region: 'ap-southeast-1',
      apiVersion: '2012-10-17',
      accessKeyId: SNS_ACCESS_KEY,
      secretAccessKey: SNS_KEY_ID,
      platformApplicationArn: IOS_BROKER_ARN,
      sandbox: true
    });
  } else {
    var iosApp = new SNS({
      platform: SNS.SUPPORTED_PLATFORMS.IOS,
      region: 'ap-southeast-1',
      apiVersion: '2012-10-17',
      accessKeyId: SNS_ACCESS_KEY,
      secretAccessKey: SNS_KEY_ID,
      platformApplicationArn: IOS_CLIENT_ARN,
      sandbox: true
    });
  }

  // Add a user, the endpointArn is their unique id
  // endpointArn is required to send messages to the device
  iosApp.addUser(deviceId, JSON.stringify({
    some: 'extra data'
  }), function(err, endpointArn) {
    if(err) { throw err; }

    var arndetail = {
      endpointArn: endpointArn
    }

    db.hgetall('hm-user.'+userId, function(err, userdetail) {
      if(userdetail.endpointArn && userdetail.endpointArn === endpointArn){
        cb('invalid', 'endpointArn exist already.');
      }else{
        db.hmset('hm-user.'+userId, arndetail);
        cb('success', 'user saved a new endpointArn');
      }
    });
  });

}

module.exports = SaveToken;

'use strict'

var Redis = require('ioredis');

function PubLocation(reqid, location, requestdetails) {
  var pub = new Redis({port: 6379,host: '127.0.0.1'});
  pub.publish(reqid+"."+location, JSON.stringify(requestdetails));
}

module.exports = PubLocation;

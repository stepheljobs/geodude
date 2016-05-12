'use strict'

var Redis = require('ioredis');

function PubRooms(requestid,clientid,brokerid, reqdetails) {
    var pub = new Redis({ port: 6379, host: '127.0.0.1'});
    console.log('pubrooms --------------> ', reqdetails);
    pub.publish("chatroom."+requestid+"."+clientid+"."+brokerid, JSON.stringify(reqdetails)); //broadcast to client
}

module.exports = PubRooms;

'use strict'

var Redis = require('ioredis');
var psubrooms = require('../service/psubrooms');

function PubRooms(requestid,clientid,brokerid) {
    var pub = new Redis({ port: 6379, host: '127.0.0.1'});
    pub.publish("chatroom."+requestid+"."+clientid+"."+brokerid, "A new room is created"); //broadcast to client
}

module.exports = PubRooms;

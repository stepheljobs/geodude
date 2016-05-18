'use strict'

var Redis = require('ioredis');
var randomstring = require('randomstring');
var psubRequest = require('../service/psubrequest');
var pubLocation = require('../service/publocation');

function CreateRequest(payload, cb) {
  var db = new Redis({port: 6379, host: '127.0.0.1'});

  db.hgetall('hm-user.'+ payload.id, function(err, data){

    var fullname = data.first_name + " " + data.last_name;
    var photo = data.photo;
    var requestCreated = {
      requestid: randomstring.generate(8),
      clientid: payload.id,
      fullname: fullname,
      photo: photo,
      country: payload.country,
      area: payload.area,
      ptype: payload.ptype,
      rentorbuy: payload.rentorbuy,
      budget: payload.budget,
      add_info: payload.add_info,
      created: Date.now()
    }

    db.set("st-req."+payload.id, requestCreated.requestid);
    db.hmset("hm-req."+requestCreated.requestid, requestCreated);
    db.hgetall("hm-req."+requestCreated.requestid, function(err, data) {
      console.log("request data sent to brokers...");

      psubRequest(requestCreated.clientid, requestCreated.requestid, function(result){
        cb("broadcast", result);
      });

      pubLocation(data.id, data.area, data, function(count){
        cb("success", { content: data, brokercount: count })
      });
    });
  });

}

module.exports = CreateRequest;

'use strict';
var Redis = require('ioredis');
var randomstring = require('randomstring');
var pubLocation = require('../service/publocation');
var psubRequest = require('../service/psubrequest');
var fetchAllRequest = require('../service/fetchallrequest');
var fetchRequestDetails = require('../service/fetchrequestdetails');
var createRequest = require('../service/createrequest');

function Request(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'setcontent': // {"route": { "module":"request", "action": "setcontent" } , "payload": {}}
      var countryArray = ["Philippines"];
      var areaArray = ["Fort Bonifacio", "Makati", "Ortigas", "Paranaque", "Alabang", "Mandaluyong"];
      var ptypeArray = ["3+ Bedrooms Condo", "2 Bedrooms Condo", "House and Lot", "Office Space", "Studio/ 1 Bedroom Condo", "Townhouse", "Commercial Space", "Other"];
      var rentorbuyArray = ["I want to Rent", "I want to Buy"];
      var rentprice = 'PHP 0 - 20,000 * PHP 21,000 - 35,000 * PHP 36,000 - 50,000 * PHP 51,000 - 75,000 * PHP 76,000 - 100,000 * PHP 101,000 - 150,000 * PHP 151,000 - 250,000 * PHP > 251,000';
      var buyprice = 'PHP 0 - 2,000,000 * PHP 2,000,000 - 3,000,000 * PHP 3,000,000 - 5,000,000 * PHP 5,000,000 - 10,000,000 * PHP 10,000,000 - 20,000,000 * PHP > 50,000,000 * PHP 20,000,000 - 50,000,000';
      var commonprice = "Undecided";

      var content = {
        country: countryArray,
        area: areaArray,
        ptype: ptypeArray,
        rentorbuy: rentorbuyArray,
        rentprice: rentprice,
        buyprice: buyprice,
        commonprice: commonprice
      }

      db.hmset("hm-req.content", content);
      db.hgetall("hm-req.content", function(err, data) {
        console.log("updating request content...");
        cb("success", { content: data });
      });
      break;
    case 'fetchcontent': // {"route": { "module":"request", "action": "fetchcontent" } , "payload": {}}
      db.hgetall("hm-req.content", function(err, data) {
        console.log("request data fetched...");
        cb("success", { content: data });
      });
      break;
    case 'create': // {"route": { "module":"request", "action": "create" } , "payload": { "id": "userid", "country": "country", "area": "area", "ptype": "ptype", "rentorbuy": "rentorbuy", "budget": "budget", "add_info": "add_info"}}

      if(req.payload.id){
        if(req.payload.country){
          if(req.payload.area){
            if(req.payload.ptype){
              if(req.payload.rentorbuy){
                if(req.payload.budget){

                  createRequest(req.payload, function(status, result){
                    cb(status, result);
                  });

                }else{ cb("incomplete", { message: "No budget data." }); }
              }else{ cb("incomplete", { message: "No rentorbuy data." }); }
            }else{ cb("incomplete", { message: "No property type data." }); }
          }else{ cb("incomplete", { message: "No area data." }); }
        }else{ cb("incomplete", { message: "No country data." }); }
      }else{ cb("incomplete", { message: "No userid data." }); }

      break;
    case 'fetchrequest': // {"route": { "module":"request", "action": "fetchrequest" } , "payload": { "id": "userid"}}

      if(req.payload.id) {
        db.get("st-req."+req.payload.id, function(err, res) {
          if(res){
            db.hgetall("hm-req."+res, function(err, data) {
              console.log("user existing request fetched...");
              cb("success", { content: data });
            });
          }else{
            cb("invalid", { message: "No request yet" });
          }
        })
      }else{
        cb("invalid", { message: "Invalid/No userid data" });
      }

      break;
    case 'fetchallrequest':
      if(req.payload.brokerid){
        fetchAllRequest(req.payload, function(status, listofrequest){ //this will fetch all the request match to cover_areas
          cb(status, listofrequest );
        });
      }else{ cb("invalid", { message: "No broker id" }); }
      break;

    case 'fetchdetails':
      if(req.payload.requestid) {
        var requestid = req.payload.requestid;
        fetchRequestDetails(requestid, function(status,result){
          console.log('----> result ', result);
          cb(status, result);
        });
      }else{
        cb("invalid", { message: "No request id" });
      }

      break;
    default:
  }
}

module.exports = Request;

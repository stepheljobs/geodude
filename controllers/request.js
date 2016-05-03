'use strict';
var Redis = require('ioredis');
var randomstring = require('randomstring');

function Request(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'setcontent': // {"route": { "module":"request", "action": "setcontent" } , "payload": {}}

    var countryArray = ["Philippines"];
    var areaArray = ["Fort Bonifacio", "Makati", "Ortigas", "Paranaque", "Alabang", "Mandaluyong"];
    var ptypeArray = ["3+ Bedrooms Condo", "2 Bedrooms Condo", "House and Lot", "Office Space", "Studio/ 1 Bedroom Condo", "Townhouse", "Commercial Space", "Other"];
    var rentorbuyArray = ["I want to Rent", "I want to buy"];
    var budgetArray = {
        rentprice: ['PHP 0 - 20,000', 'PHP 21,000 - 35,000', 'PHP 36,000 - 50,000', 'PHP 51,000 - 75,000', 'PHP 76,000 - 100,000', 'PHP 101,000 - 150,000', 'PHP 151,000 - 250,000', 'PHP > 251,000'],
        buyprice: ['PHP 0 - 2,000,000', 'PHP 2,000,000 - 3,000,000', 'PHP 3,000,000 - 5,000,000', 'PHP 5,000,000 - 10,000,000', 'PHP 10,000,000 - 20,000,000', 'PHP > 50,000,000', 'PHP 20,000,000 - 50,000,000'],
        common: "Undecided"
    }

      var content = {
        country: countryArray,
        area: areaArray,
        ptype: ptypeArray,
        rentorbuy: rentorbuyArray,
        budget: budgetArray
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
    case 'create': // {"route": { "module":"request", "action": "create" } , "payload": { "id": "userid", "country": "country", "area": "area", "ptype": "ptype", "rentorbuy": "rentorbuy", "budget": "budget"}}

      if(req.payload.id){
        if(req.payload.country){
          if(req.payload.area){
            if(req.payload.ptype){
              if(req.payload.rentorbuy){
                if(req.payload.budget){

                  var requestCreated = {
                    id: randomstring.generate(8),
                    userid: req.payload.id,
                    country: req.payload.country,
                    area: req.payload.area,
                    ptype: req.payload.ptype,
                    rentorbuy: req.payload.rentorbuy,
                    budget: req.payload.budget,
                    created: Date.now()
                  }

                  db.set("st-req."+req.payload.id, requestCreated.id);
                  db.hmset("hm-req."+requestCreated.id, requestCreated);

                  
                }else{
                  cb("incomplete", { message: "No budget data." });
                }
              }else{
                cb("incomplete", { message: "No rentorbuy data." });
              }
            }else{
              // ptype
              cb("incomplete", { message: "No property type data." });
            }
          }else{
            // area
            cb("incomplete", { message: "No area data." });
          }
        }else{
          // country
          cb("incomplete", { message: "No country data." });
        }
      }else{
        // userid
        cb("incomplete", { message: "No userid data." });
      }

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
    default:
  }
}

module.exports = Request;
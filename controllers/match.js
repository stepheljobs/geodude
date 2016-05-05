'use strict';

var Redis = require('ioredis');
var pubRequest = require('../service/pubrequest');

function Match(req, cb) {
  var db = new Redis({port: 6379,host: '127.0.0.1'});

  switch (req.route.action) {
    case 'haveit':
        console.log('someone says i have it: ', req);
        pubRequest(req.payload);
      break;
    default:
  }
}

module.exports = Match;

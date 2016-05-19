'use strict'

function ForgotPassword(payload, cb) {
  var Redis             = require('ioredis'),
      db                = new Redis({port: 6379, host: '127.0.0.1'}),
      bcrypt            = require('bcrypt'),
      randomstring      = require('randomstring'),
      sendPasswordEmail = require('../util/sendpasswordemail');

  if (payload.email) {
    var email = payload.email;
    var randomPassword = randomstring.generate(8);
    var newPassword = { password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10)) }

    db.get('st-user.'+email, function(err, userid) {
      if(userid) {
        db.hmset("hm-user."+userid, newPassword);
        sendPasswordEmail(email,randomPassword);
        cb('success', 'a new password is set.');
      } else {
        cb('invalid', 'email is not register.');
      }
    });
  } else { cb('incomplete', 'no email provided.'); }

}

module.exports = ForgotPassword;

'use strict'
const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);

function sendEmail(event, email) {

  if (event === 'signup') {
    var details = {
      receiver: email,
      sender: 'hello@get.place',
      subject: 'Welcome to Get.Place',
      body: 'Welcome to Get.Place, Thanks for signing up. Signup Templates here',
    }
  } else if(event === 'forgotpass') {

  }

  sendgrid.send({
    to:       details.receiver,
    from:     details.sender,
    subject:  details.subject,
    text:     details.body
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });

}

module.exports = sendEmail;

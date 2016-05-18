'use strict'
const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);

function SignupEmail(email) {

  var cardEmail = new sendgrid.Email({
    to: email,
    from: "hello@get.place",
    subject: 'Welcome to Get.Place',
    html: '<h2>Welcome to Get.Place, Thanks for signing up</h2>', // This fills out the <%body%> tag inside your SendGrid template
  });

  // Tell SendGrid which template to use, and what to substitute. You can use as many substitutions as you want.
  cardEmail.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "21a2137c-1240-43bf-aad1-5f09d119cbcb"}}}); // Just replace this with the ID of the template you want to use

  // Everything is set up, let's send the email!
  sendgrid.send(cardEmail, function(err, json){
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent!');
    }
  });

}

module.exports = SignupEmail;

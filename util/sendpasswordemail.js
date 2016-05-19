'use strict'
const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);

function SignupEmail(email, newpassword) {

  var cardEmail = new sendgrid.Email({
    to: email,
    from: "hello@get.place",
    subject: 'Your new password is here.',
    html: newpassword, // This fills out the <%body%> tag inside your SendGrid template
  });

  // Tell SendGrid which template to use, and what to substitute. You can use as many substitutions as you want.
  cardEmail.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "9aaa405d-0c0a-4d86-b9c5-180edcc08b84"}}}); // Just replace this with the ID of the template you want to use

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

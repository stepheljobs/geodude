'use strict'
const dotenv = require('dotenv');
dotenv.load({ path: '.env.example' });

var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);

function SendMatchEmail(email) {

  var cardEmail = new sendgrid.Email({
    to: email,
    from: "hello@get.place",
    subject: 'You have a match!',
    html: '<h2>Welcome to Get.Place, Thanks for signing up</h2>', // This fills out the <%body%> tag inside your SendGrid template
  });

  cardEmail.setFilters({"templates": {"settings": {"enabled": 1, "template_id": "f2fc493c-9213-4c4e-9718-6a4f1e0eeb6e"}}}); // Just replace this with the ID of the template you want to use

  // Everything is set up, let's send the email!
  sendgrid.send(cardEmail, function(err, json){
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent!');
    }
  });

}

module.exports = SendMatchEmail;

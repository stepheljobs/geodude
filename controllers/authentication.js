var User = require('../models/User');
var randomstring = require("randomstring");

exports.facebookSignup = function(profile){
  console.log('profile: ' + profile);

  var user = new User({
    id: randomstring.generate(7),
    email: profile.email,
    facebookid: profile.id,
    profile: {
      firstname: profile.first_name,
      lastname: profile.last_name,
      photo: profile.picture.data.url
    }
  });

  User.findOne({ email: profile.email }, function(err, existingUser) {
    if (existingUser) {
      console.log('existing user user will be logged in');
    }else{
      console.log('user will be signup and saved');
      user.save(function(err) {
        if (err) {
          return next(err);
        }
      });
    }
  });
}

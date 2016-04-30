var http = require('http');
var sockjs = require('sockjs');
request = require('request');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', function(conn) {
    console.log('conn: ', conn);

    conn.on('data', function(message) {
        console.log('message: ', message);
        var data = JSON.parse(message);
        var profile;

        request.get('https://graph.facebook.com/me?fields=first_name,last_name,email,picture&access_token='+ data.payload.token, function(err, request, result) {
          profile = JSON.parse(result);
          if(profile.error) {
            // socket.emit('response', { code: '404', payload: {}, message: profile.error.message });
            console.log('error: ', profile.error.message);
          } else {
            // authController.facebookSignup(profile);
            // socket.emit('response', { code: '200', payload: profile, message: 'success' });
            conn.write(JSON.stringify(profile));
            console.log('success: ', profile);
          }
        });

    });
    conn.on('close', function() {});
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(3000, '0.0.0.0');

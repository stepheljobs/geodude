var http = require('http');
var sockjs = require('sockjs');
var socket = require('./socket');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', socket);

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(3000, '0.0.0.0');

/**
 * Module dependencies.
 */
const express = require('express');
const compress = require('compression');
const session = require('express-session');
const errorHandler = require('errorhandler');
const flash = require('express-flash');
const path = require('path');
const sass = require('node-sass-middleware');
const dotenv = require('dotenv');

dotenv.load({ path: '.env.example' });

/**
  * Sockets
  */
var http = require('http');
var sockjs = require('sockjs');
var socket = require('./socket');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', socket);

dotenv.load({ path: '.env.example' });

var homeController = require('./controllers/home');

/**
 * Create Express server.
 */
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(express.static(path.join(__dirname, 'views'), { maxAge: 31557600000 }));
// app.get('/', homeController.index);
app.use(errorHandler());

var server = http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});

echo.installHandlers(server, {prefix:'/echo'});

module.exports = app;

// The express app will enable the appointment scheduler app to interact with the MongoDB database.
// First, edit the app.js file to add our mongoose connection.

var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// TODO: Add favicon
//var favicon = require('serve-favicon');
// TODO: Review mongoose and body-parser
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const api = require('./routes/api/index');

// Loads configuration settings for environment
const config = require('dotenv').config;

var app = express();

// See Promises in JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
mongoose.Promise = global.Promise;

// Add a connection to the database using mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useMongoClient: true
});

// TODO: Look into this a bit, configure properly.
//This enabled CORS, Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) 
//on a web page to be requested from another domain outside the domain from which the first resource was served
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO: Uncomment next line after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon-32x32.png')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', api);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Notes

/* 
 * Models:
 * To access the MongoDB database using mongoose, we need to define schemas and models. schemas and models convey to mongoose a simplified representation of the data structure comprising of fields and data types.

/* Routes:
 * Express makes use of routes to handle request and responses from the client app (appointment scheduler in this case) and MongoDB.

/* Controllers:
 * Controllers are actually callback functions. Moving forward appointmentController.all, slotController.all and appointmentController.create are callback functions which we are referring to as controllers.

/* Promise enables asynchronous method calls (DB calls, here) similar to Tasks in .Net so our application can keep working without waiting on a single method call. See Promises in JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

/* Configure your credentials, connections, settings to be stored properly in external uncommitted file. See: https://github.com/motdotla/dotenv
 * 
*/

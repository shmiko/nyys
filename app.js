var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var flash = require('connect-flash');
var csrf = require('csurf')

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var comments = require('./routes/comments');

var app = express();

app.engine('html', require('ejs').renderFile);

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'super duper secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    /*res.render('error', {
      message: err.message,
      error: err
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

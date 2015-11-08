var express = require('express');
var router = express.Router();
var passport = require('passport');
var models  = require('../models');

// index
router.get('/', function (req, res, next) {
  res.render('index');
});

// Render partials, used by Angular.
router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

// Endpoint used by angular to check if user is logged in.
router.get('/user', function (req, res, next) {
  res.send(req.user);
});

// Login, signup and logout are handled seperately from Angular by
// Passport. Logic for passport can be found at config/passport.js.

// LOGOUT
router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

// LOGIN
router.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login', { message: req.flash('error'), csrftoken: req.csrfToken() });
  }
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash : true
}));

// SIGNUP
router.get('/signup', function (req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('signup', { message: req.flash('error'), csrftoken: req.csrfToken() });
  }
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/',
	failureRedirect : '/signup',
	failureFlash : true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated) {
    return next();
  }

  res.sendStatus(401);
}

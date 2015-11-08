var LocalStrategy = require('passport-local').Strategy;
var models  = require('../models');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.findById(id).then(function(user){
	    done(null, user);
		}).catch(function(e){
			done(e, false);
		});
  });

  passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
			models.User.findOne({ where: { username: username }})
				.then(function(user) {
					if (!user) {
						done(null, false, { message: 'bad username' });
					} else if (!user.validPassword(password)) {
						done(null, false, { message: 'bad password' });
					} else {
						done(null, user);
					}
				})
				.catch(function(err) {
					done(null, false, { message: err });
				});
	}));

  passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
      models.User.findOne({ where: { username: username }})
        .then(function(existingUser) {
          if (existingUser) {
            return done(null, false, { message: 'username taken' });
          } else if (username.length > 50) {
            return done(null, false, { message: 'username too long, maximum is 50 characters' });
          } else {
            var newUser = models.User.build({
              username: username,
              password: models.User.generateHash(password)
            });
            newUser.save()
              .then(function() {
                done (null, newUser);
              })
              .catch(function(err) {
                done(null, false, { message: err });
              });
          }
        })
        .catch(function (err) {
          done(null, false, { message: err });
        })
   }));
}

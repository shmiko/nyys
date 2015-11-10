'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var Sequelize = require('sequelize');
var models  = require('../../models');

chai.use(chaiAsPromised);
chai.should();

describe('User', function () {
  var result = { username: 'foo', password: 'bar', bio: 'bundy' };
  var longString = 'a'.repeat(355);

  // Recreate the database after each test to ensure isolation
  beforeEach(function (done) {
    models
      .sequelize
      .sync({ force: true }) /* creates db tables from models */
      .then(function () {
        done();
      })
      .error(function (error) {
        done(error);
      });
  });

  it('should create a user with valid properties', function (done) {
    var newUser = models.User.build({ username: 'foo', password: 'bar', bio: 'bundy' });
    newUser.save().then(function (user) {
      user.username.should.equal(result.username);
      user.password.should.equal(result.password);
      user.bio.should.equal(result.bio);
      done();
    });
  });

  it('should not create a user with empty properties', function (done) {
    var emptyUser = models.User.build({ username: '', password: '', bio: '' });
    emptyUser.save().should.be.rejected;
    done();
  });

  it('should not create a user with too long username', function (done) {
    var longUsernameUser = models.User.build({ username: longString, password: 'pass', bio: 'bio' });
    longUsernameUser.save().should.be.rejected;
    done();
  });

  it('should not create a user with too long bio', function (done) {
    var longBioUser = models.User.build({ username: 'username', password: 'pass', bio: longString });
    longBioUser.save().should.be.rejected;
    done();
  });
});

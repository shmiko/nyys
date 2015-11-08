'use strict';
var Sequelize = require('sequelize');
// Cache the sequelize logging output till after all the tests have run
var sequelize = new Sequelize('forum', '', '', {
  dialect: 'sqlite',
  storage: 'database_test.sqlite'
});

var models  = require('../../models');

// Run model tests
describe('Model tests', function () {
  var result = {};
  var testArticle = {
    title : "Test",
    slug: "test",
    body: "lorem ipsum",
    author : "Me",
  }
  // Recreate the database after each test to ensure isolation
  beforeEach(function (done) {
    sequelize.sync({force: true})
      .then(function () {
          done();
      })
      .error(function(error) {
        done(error);
      });
  });

  describe('With a valid user', function () {
    before(function (done) {
      var newUser = models.User.build({username: 'thisngaaa', password: 'thing', bio: 'thing'});

      newUser.save()
      .then(function(user) {
        newUser = user;
        done();
      })
      .catch(function(err) {
        console.log(err);
      });
    });

    it('should create a user with valid properties', function (done) {
      newUser.success.should.equal(true);
    });
  });
});

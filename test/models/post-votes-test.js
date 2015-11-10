'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var Sequelize = require('sequelize');
var models  = require('../../models');

chai.use(chaiAsPromised);
chai.should();

describe('PostVote', function () {
  var newUser = { username: 'foo', password: 'bar', bio: 'bundy' };
  var newPost = { title: 'foo', url: 'bar', content: 'bundy', UserId: 1 };

  // Recreate the database after each test to ensure isolation
  beforeEach(function (done) {
    models
      .sequelize
      .sync({ force: true }) /* creates db tables from models */
      .then(function () {
        var testUser = models.User.build(newUser);
        var testPost = models.Post.build(newPost);
        testUser.save().then(function (user) {
          testPost.save().then(function (post) {
            post.addUser(user);
            done();
          });
        });

      })
      .error(function (error) {
        done(error);
      });
  });

  it('should create a new association', function (done) {
    models.Post.findById(1).then(function (post) {
      post.countUsers().then(function (count) {
        console.log(count);
        count.should.equal(1);
        done();
      });
    });
  });
});

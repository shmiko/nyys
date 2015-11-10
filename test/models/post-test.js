'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var Sequelize = require('sequelize');
var models  = require('../../models');

chai.use(chaiAsPromised);
chai.should();

describe('Post', function () {
  var newUser = { username: 'foo', password: 'bar', bio: 'bundy' };
  var result = { title: 'foo', url: 'bar', content: 'bundy', UserId: 1 };

  var longString = 'a'.repeat(5001);

  // Recreate the database after each test to ensure isolation
  beforeEach(function (done) {
    models
      .sequelize
      .sync({ force: true }) /* creates db tables from models */
      .then(function () {
        var testUser = models.User.build(newUser);
        testUser.save().then(function (user) {
          done();
        });
      })
      .error(function (error) {
        done(error);
      });
  });

  it('should create a post with valid properties', function (done) {
    var newPost = models.Post.build({ title: 'foo', url: 'bar', content: 'bundy', UserId: 1 });
    newPost.save().then(function (post) {
      post.title.should.equal(result.title);
      post.url.should.equal(result.url);
      post.content.should.equal(result.content);
      done();
    });
  });

  it('should not create a post with empty properties', function (done) {
    var emptyPost = models.Post.build({ title: '', url: '', content: '', UserId: 1 });
    emptyPost.save().should.be.rejected;
    done();
  });

  it('should not create a post with too long title', function (done) {
    var longTitlePost = models.Post.build({ title: longString, url: 'url', content: 'content', UserId: 1 });
    longTitlePost.save().should.be.rejected;
    done();
  });

  it('should not create a post with too long url', function (done) {
    var longUrlPost = models.Post.build({ title: 'title', url: longString, content: 'content', UserId: 1 });
    longUrlPost.save().should.be.rejected;
    done();
  });

  it('should not create a post with too long content', function (done) {
    var longContentPost = models.Post.build({ title: 'title', url: 'url', content: longString, UserId: 1 });
    longContentPost.save().should.be.rejected;
    done();
  });
});

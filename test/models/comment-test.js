'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var Sequelize = require('sequelize');
var models  = require('../../models');

chai.use(chaiAsPromised);
chai.should();

describe('Comment', function () {
  var newUser = { username: 'foo', password: 'bar', bio: 'bundy' };
  var newPost = { title: 'foo', url: 'bar', content: 'bundy', UserId: 1 };
  var result = { content: 'foo', UserId: 1, PostId: 1, CommentId: 1 };

  var longString = 'a'.repeat(5001);

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
            done();
          });
        });

      })
      .error(function (error) {
        done(error);
      });
  });

  it('should create a comment with valid properties', function (done) {
    var newComment = models.Comment.build({ content: 'foo', UserId: 1, PostId: 1 });
    newComment.save().then(function (comment) {
      comment.content.should.equal(result.content);
      comment.UserId.should.equal(result.UserId);
      comment.PostId.should.equal(result.PostId);
      done();
    });
  });

  it('should not create a comment with empty content', function (done) {
    var emptyComment = models.Comment.build({ content: '', UserId: 1, PostId: 1 });
    emptyComment.save().should.be.rejected;
    done();
  });

  it('should not create a comment with too long content', function (done) {
    var longComment = models.Comment.build({ content: longString, UserId: 1, PostId: 1 });
    longComment.save().should.be.rejected;
    done();
  });

  it('should set the CommentId correctly', function (done) {
    var newComment = models.Comment.build({ content: 'foo', UserId: 1, PostId: 1 });
    newComment.save().then(function (comment) {
      var newReply = models.Comment.build({ content: 'bar', UserId: 1, PostId: 1, CommentId: comment.id });
      newReply.save().then(function (reply) {
        reply.CommentId.should.equal(result.CommentId);
        done();
      });
    });
  });
});

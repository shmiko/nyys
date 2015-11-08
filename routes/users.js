var express = require('express');
var router = express.Router();
var models  = require('../models');
var upvotes = require('../services/upvotes');
var nestComments = require('../services/nest-comments');

// User profile.
router.get('/:user_id', function (req, res) {
  models.User.findOne({
    where: { id: req.params.user_id },
    attributes: ['id', 'username', 'bio', 'createdAt']
  })
  .then(function (user) {
    if (!user) {
      return res.status(400).send('no such user');
    }
    res.send(user);
  });
});

// Update user bio.
router.post('/:user_id/update', function (req, res, next) {
  models.User.findById(req.params.user_id).then(function (user) {
    // if bio is longer than 300 characters, render error status and send a message
    if (req.body['bio'].length > 300) {
      return res.status(400).send('about too long, max is 300 chars');
    }
    // otherwise update the entry
    user.update({ bio: req.body['bio']})
    .then(function (user) {
      // CHECK WHAT THIS SENDS, LIMIT SENDING PASSWORD
      res.json({
        user : {
          id: user.id,
          username: user.username,
          bio: user.bio,
          createdAt: user.createdAt
        }
      });
    })
    .catch(function (error) {
      res.sendStatus(500);
    });
  });
});

// List User posts.
router.get('/:user_id/posts', function (req, res, next) {
  models.User.findById(req.params.user_id).then(function (user) {
    // if the user id parameter is invalid, redirect to root
    if (!user) {
      return res.status(400).send('no such user');
    }

    // find all posts made by user
    models.Post.findAll({
      attributes: ['id', 'title', 'createdAt'],
      where: { UserId: user.id },
      order: '"Post"."createdAt" DESC',
      include: [
        { model: models.User, attributes: ['id', 'username'] },
        { model: models.Comment, attributes: ['id'] },
      ]
    })
    .then(function (posts) {
      posts.forEach(function (post) {
        // Pass the length of the comments to the view instead of the comments themselves
        post.dataValues.Comments = post.dataValues.Comments.length;
      });

      upvotes.countUpvotes(posts)
      .then(function (postsWithVotes) {
        upvotes.hasUserUpvoted(postsWithVotes, req.user)
        .then(function (reformattedPosts) {
          res.send(
            postsWithVotes.map(function (post) {
              return {
                id: post.dataValues.id,
                url: post.dataValues.url,
                title: post.dataValues.title,
                upvotes: post.dataValues.upvotes,
                hasUserUpvoted: post.dataValues.hasUserUpvoted,
                User: post.dataValues.User,
                Comments: post.dataValues.Comments
              };
            })
          );
        });
      });
    })
    .catch(function (err) {
      console.log(err);
      res.sendStatus(500);
    });
  });
});

module.exports = router;

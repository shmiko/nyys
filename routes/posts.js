var express = require('express');
var router = express.Router();
var models  = require('../models');
var upvotes = require('../services/upvotes');
var nestComments = require('../services/nest-comments');

// Get a list of posts for the index page.
router.get('/', function (req, res, next) {
  models.Post.findAll({
    attributes: ['id', 'title', 'url', 'createdAt', ],
    order: '"Post"."createdAt" DESC',
    include: [
      // Include the User of each post
      { model: models.User, attributes: ['id', 'username'] },
      // Include the comments of each post to calculate their amount
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

// Show post
router.get('/:post_id', function (req, res) {
  models.Post.findOne({
    where: { id: req.params.post_id },
    attributes: ['id', 'title', 'url', 'content', 'createdAt'],
    include: [{ model: models.User, attributes: ['id', 'username']}]
  })
  .then(function (post) {
    // If no post is found, send back an error status with a message.
    if (!post) {
      return res.status(400).send('no such post');
    }

    models.Comment.findAll({
      where: { PostId: req.params.post_id },
      attributes: ['id', 'content', 'UserId', 'CommentId', 'PostId', 'createdAt'],
      include: [
        // Include the user of each comment.
        { model: models.User, attributes: ['id', 'username'] },
      ],
      order: '"Comment"."createdAt" ASC'
    })
    .then(function (comments) {
      var nestedComments = nestComments(comments);
      res.json({post: post, comments: nestedComments});
    });
  });
});

router.post('/:post_id/upvote', function (req, res) {
  models.Post.findById(req.params.post_id)
  .then(function (post) {
    post.addUser(req.user);
    res.sendStatus(200);
  })
  .catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  })
})

// Submit a new post, isLoggedIn requires user to be logged in to submit a post.
router.post('/submit', isLoggedIn, function (req, res, next) {
  // if no post content, render submit form with error message
  if (!req.body['url'] && !req.body['content']) {
    return res.status(400).send('either url or content required');
  }

  // content length validation, render error if content is longer than 5000 characters
  if (req.body['content'].length > 5000) {
    return res.status(400).send('content too long, max is 5000 chars');
  }

  // build a new post, assign the id of the logged in user to the UserId attribute
  var newPost = models.Post.build({
    title: req.body['title'],
    url: req.body['url'],
    content: req.body['content'],
    UserId: req.user.id
  });

  newPost.save()
    .then(function (post) {
      res.json(post);
    })
    .catch(function (err) {
      res.sendStatus(500);
    });
});

// Submit a new comment, isLoggedIn requires user to be logged in to submit a comment.
router.post('/:post_id/comment', isLoggedIn, function (req, res, next) {
  // if comment is empty, return an error
  if (!req.body['content']) {
    return res.status(400).send("can't post an empty comment");
  }

  // content length validation, return an error if comment is longer than 1000 characters
  if (req.body['content'].length > 1000) {
    return res.status(400).send('comment too long, maximum is 1000 chars');
  }

  // Build a new comment, assign the id of the currently logged in user to UserId.
  var newComment = models.Comment.build({
    content: req.body['content'],
    UserId: req.user.id,
    PostId: req.params.post_id
  });

  newComment.save()
    .then(function (comment) {
      res.send(comment);
    })
    .catch(function (err) {
      res.sendStatus(500);
    });
});

module.exports = router;

// helper function to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.user)
    return next();

  res.redirect('/');
}

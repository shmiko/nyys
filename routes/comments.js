var express = require('express');
var router = express.Router();
var models  = require('../models');

// Show comment
router.get('/:comment_id', function (req, res) {
  models.Comment.findOne({
    where: { id: req.params.comment_id },
    attributes: ['id', 'content', 'PostId', 'createdAt'],
    include: [
      { model: models.User, attributes: ['id', 'username'] },
    ],
  })
  .then(function (comment) {
    if (!comment) {
      return res.status(400).send('no such comment');
    }

    res.send(comment);
  });
});

// Post a reply to a comment
router.post('/:comment_id/reply', isLoggedIn, function (req, res, next) {
  // if the reply is empty, return an error
  if (!req.body['content']) {
    return res.status(400).send("can't post an empty reply");
  }

  // content length validation, return an error if reply is longer than 3000 characters
  if (req.body['content'].length > 3000) {
    return res.status(400).send('reply too long, maximum is 3000 chars');
  }

  var newComment = models.Comment.build({
    content: req.body['content'],
    UserId: req.user.id,
    PostId: req.body['PostId'],
    CommentId: req.params.comment_id
  });

  newComment.save()
    .then(function (comment) {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.sendStatus(500);
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated) {
    return next();
  }

  res.sendStatus(401);
}

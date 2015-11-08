var Promise = require("bluebird");

module.exports = {
  countUpvotes: function (posts) {
    return Promise.map(posts, function (post) {
      return post.countUsers().then(function (upvotes) {
        post.dataValues.upvotes = upvotes;
        return post;
      });
    });
  },

  hasUserUpvoted: function (posts, user) {
    return Promise.map(posts, function (post) {
      return post.hasUser(user).then(function (boolean) {
        post.dataValues.hasUserUpvoted = boolean;
        return post;
      });
    });
  }
};

function findAllReplies(comments, parentId) {
  var replies = [];
  // Iterate through the unsorted array provided by sequelize query.
  comments.forEach(function (comment) {
    // If the comments CommentId is the same as the id of the Comment whose
    // children we are looking for, it's a reply to the comment.
    if (comment.dataValues.CommentId == parentId) {
      // Find the replies of the replies
      comment.dataValues.replies = findAllReplies(comments, comment.id);
      // After return, push the found comments into the reply array.
      replies.push(comment);
    }

    // If no replies are found, return.
    return;
  });

  return replies;
}

module.exports = function (comments) {
  var nestedComments = []
  comments.forEach(function (comment){
  	// If the CommentId is null, the comment is not a reply, i.e. it's at the topmost
    // level of the comment hierarchy. The nesting starts from the topmost level.
  	if (comment.dataValues.CommentId == null) {
  		// Find all the replies of the topmost comment
  		comment.dataValues.replies = findAllReplies(comments, comment.id);
  		// After finding all the replies recursively, push the comment into the
      // reformatted list.
  		nestedComments.push(comment);
  	}
  });

  return nestedComments;
}

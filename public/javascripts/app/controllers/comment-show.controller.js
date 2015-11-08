(function (){
  angular.module('forumApp.controllers')
    .controller(
      'CommentShowCtrl',
      ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'Comment', CommentShowCtrl]
    );

  function CommentShowCtrl($scope, $rootScope, $location, $window, $routeParams, Comment) {
    if (!$rootScope.currentUser) {
      $window.location.href = 'login';
    }

    $scope.reply = {
      content: '',
      PostId: undefined
    }
    $scope.submitReply = submitReply;

    getComment($routeParams.commentId);

    function getComment(id) {
      Comment.getComment(id)
      .success(function (comment) {
        $scope.comment = comment;
        $scope.reply.PostId = comment.PostId;
      })
      .catch(function (err) {
        $location.url('/');
      });
    }

    function submitReply() {
      Comment.submitReply($routeParams.commentId, $scope.reply)
      .success(function () {
        $scope.reply.content = '';
        $location.url('/posts/' + $scope.reply.PostId);
      })
      .catch(function (err) {
        $scope.message = err.data;
      });
    }
  }
})();

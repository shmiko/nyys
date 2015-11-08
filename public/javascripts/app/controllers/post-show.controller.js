(function (){
  angular.module('forumApp.controllers')
    .controller(
      'PostShowCtrl',
      ['$scope', '$rootScope', '$location', '$routeParams', 'Post', PostShowCtrl]
    );

  function PostShowCtrl($scope, $rootScope, $location, $routeParams, Post) {
    $scope.comments = [];
    $scope.post = {};
    $scope.comment = { content: '' };
    $scope.message = '';
    $scope.submitComment = submitComment;

    getPost($routeParams.postId);

    function getPost(id) {
      Post.getPost(id)
      .success(function (response) {
        $scope.post = response.post;
        $scope.comments = response.comments;

        // Parse hostnames from the url for the view.
        if ($scope.post.url) {
          var parser = document.createElement('a');
          parser.href = $scope.post.url
          $scope.post.hostname = parser.hostname;
        }
      })
      .catch(function (err) {
        $location.url('/');
      });
    }

    function submitComment() {
      Post.submitComment($routeParams.postId, $scope.comment)
      .success(function (comment) {
        comment.User = $rootScope.currentUser
        $scope.comments.push(comment);
        $scope.message = "comment posted";
        $scope.comment.content = '';
      })
      .catch(function (err) {
        $scope.message = err.data;
      });
    }
  }
})();

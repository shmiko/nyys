(function (){
  angular.module('forumApp.controllers')
    .controller(
      'UserPostsCtrl',
      ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'User', 'Post', UserPostsCtrl]
    );

  function UserPostsCtrl($scope, $rootScope, $location, $window, $routeParams, User, Post) {
    $scope.posts = [];
    $scope.upvote = upvote;
    $scope.userId = $routeParams.userId;

    getPosts($routeParams.userId);

    function getPosts(id) {
      User.getPosts(id)
      .success(function (posts) {
        $scope.posts = posts;
      })
      .catch(function (err) {
        $location.url('/');
      });
    }

    function upvote(id) {
      if (!$rootScope.currentUser) {
        $window.location.href = 'login';
      }
      Post.upvote(id)
      .success(function () {
        $location.url('/users/' + $scope.userId + '/posts');
      })
      .catch(function(err) {
        console.log(err);
      })
    }
  }
})();

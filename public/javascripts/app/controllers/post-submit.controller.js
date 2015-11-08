(function (){
  angular.module('forumApp.controllers')
    .controller(
      'PostSubmitCtrl',
      ['$scope', '$rootScope', '$location', '$window', 'Post', PostSubmitCtrl]
    );

  function PostSubmitCtrl($scope, $rootScope, $location, $window, Post) {
    if (!$rootScope.currentUser) {
      $window.location.href = 'login';
    }

    $scope.message = '';
    $scope.submitPost = submitPost;

    function submitPost() {
      Post.submitPost($scope.post)
      .success(function (post) {
        $location.url('/posts/' + post.id);
      })
      .catch(function (err) {
        $scope.message = err.data;
      });
    }
  }
})();

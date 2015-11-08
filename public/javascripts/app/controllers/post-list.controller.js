(function (){
  angular.module('forumApp.controllers')
    .controller(
      'PostListCtrl',
      ['$scope', '$rootScope', '$location', '$window', 'Post', PostListCtrl]
    );

  function PostListCtrl($scope, $rootScope, $location, $window, Post) {
    $scope.posts = [];
    $scope.upvote = upvote;

    getPosts();

    function getPosts() {
      Post.getPosts()
      .success(function (posts) {
        // Parse hostnames from the url for the view.
        var parser = document.createElement('a');
        posts.forEach(function (post) {
          if (post.url) {
            parser.href = post.url
            post.hostname = parser.hostname;
          }
        })
        $scope.posts = posts;
      });
    }

    function upvote(id) {
      if (!$rootScope.currentUser) {
        $window.location.href = 'login';
      }
      Post.upvote(id)
      .success(function () {
        $location.url('/');
      })
      .catch(function(err) {
        console.log(err);
      })
    }
  }
})();

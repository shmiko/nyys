(function (){
  angular.module('forumApp', [
    'forumApp.controllers',
    'forumApp.services',
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'angularMoment'
  ]);

  angular.module('forumApp.controllers', []);

  angular.module('forumApp')
    .run(function ($rootScope, $http, $window) {
      // store current user even in case of refresh
      $http.get('/user').success(function (user) {
        $rootScope.currentUser = user;
      });
    })
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'partials/post-list.html',
            controller: 'PostListCtrl'
          })
          .when('/submit', {
            templateUrl: 'partials/post-submit.html',
            controller: 'PostSubmitCtrl'
          })
          .when('/posts/:postId', {
            templateUrl: 'partials/post-show.html',
            controller: 'PostShowCtrl'
          })
          .when('/comments/:commentId', {
            templateUrl: 'partials/comment-show.html',
            controller: 'CommentShowCtrl'
          })
          .when('/users/:userId', {
            templateUrl: 'partials/user-profile.html',
            controller: 'UserProfileCtrl'
          })
          .when('/users/:userId/posts', {
            templateUrl: 'partials/user-posts.html',
            controller: 'UserPostsCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
      }
    ]);
  })();

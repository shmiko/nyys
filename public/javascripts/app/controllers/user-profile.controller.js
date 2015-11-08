(function (){
  angular.module('forumApp.controllers')
    .controller(
      'UserProfileCtrl',
      ['$scope', '$location', '$routeParams', 'User', UserProfileCtrl]
    );

  function UserProfileCtrl($scope, $location, $routeParams, User) {
    $scope.user = {};
    $scope.message = '';
    $scope.updateUser = updateUser;

    getUser($routeParams.userId);

    function getUser(id) {
      User.getUser(id)
      .success(function (user) {
        $scope.user = user;
      })
      .catch(function (err) {
        $location.url('/');
      });
    }

    function updateUser() {
      User.updateUser($routeParams.userId, $scope.user)
      .success(function (user) {
        $scope.message = 'bio updated';
      })
      .catch(function (err) {
        $scope.message = err.data;
      })
    }
  }
})();

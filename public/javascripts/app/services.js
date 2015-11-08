(function (){
  angular.module('forumApp.services', [])
    .factory('Api', ['$http', Api])
    .factory('Post', ['Api', Post])
    .factory('Comment', ['Api', Comment])
    .factory('User', ['Api', User]);

    function Api($http) {
      return {
        get: function (url) {
            return $http.get(url);
        },

        post: function (url, data) {
            return $http.post(url, data);
        },
      };
    }

    function Post(Api) {
      var url = '/posts/';

      return {
        getPosts: function () {
          return Api.get(url);
        },

        getPost: function (id) {
          return Api.get(url + id);
        },

        submitPost: function (post) {
          return Api.post(url + 'submit', post);
        },

        submitComment: function (id, comment) {
          return Api.post(url + id + '/comment', comment);
        },

        upvote: function(id) {
          return Api.post(url + id + '/upvote');
        }
      };
    }

    function Comment(Api) {
      var url = '/comments/';

      return {
        getComment: function (id) {
          return Api.get(url + id);
        },

        submitReply: function (id, reply) {
          return Api.post(url + id + '/reply', reply);
        }
      };
    }

    function User(Api) {
      var url = '/users/';

      return {
        getUser: function (id) {
          return Api.get(url + id);
        },

        getPosts: function (id) {
          return Api.get(url + id + '/posts');
        },

        updateUser: function (id, user) {
          return Api.post(url + id + '/update', user);
        }
      };
    }
})();

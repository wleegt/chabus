// Movinglines service used to communicate Movinglines REST endpoints
(function () {
  'use strict';

  angular
    .module('movinglines')
    .factory('MovinglinesService', MovinglinesService);

  MovinglinesService.$inject = ['$resource'];

  function MovinglinesService($resource) {
    return $resource('api/movinglines/:movinglineId', {
      movinglineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

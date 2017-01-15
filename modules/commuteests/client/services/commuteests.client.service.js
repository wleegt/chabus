// Commuteests service used to communicate Commuteests REST endpoints
(function () {
  'use strict';

  angular
    .module('commuteests')
    .factory('CommuteestsService', CommuteestsService);

  CommuteestsService.$inject = ['$resource'];

  function CommuteestsService($resource) {
    return $resource('api/commuteests/:commuteestId', {
      commuteestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

// Estimatenews service used to communicate Estimatenews REST endpoints
(function () {
  'use strict';

  angular
    .module('estimatenews')
    .factory('EstimatenewsService', EstimatenewsService);

  EstimatenewsService.$inject = ['$resource'];

  function EstimatenewsService($resource) {
    return $resource('api/estimatenews/:estimatenewId', {
      estimatenewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

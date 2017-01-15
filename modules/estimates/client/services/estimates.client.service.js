'use strict';

//Estimates service used for communicating with the estimates REST endpoints
angular.module('estimates').factory('EstimatesService', ['$resource',
  function ($resource) {
    return $resource('api/estimates/:estimateId', {
      estimateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

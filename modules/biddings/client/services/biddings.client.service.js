// Biddings service used to communicate Biddings REST endpoints
(function () {
  'use strict';

  angular
    .module('biddings')
    .factory('BiddingsService', BiddingsService);

  BiddingsService.$inject = ['$resource'];

  function BiddingsService($resource) {
    return $resource('api/biddings/:biddingId', {
      biddingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

// Setting up route
  angular
  .module('estimates')
  .config(routeConfig);
  routeConfig.$inject=['$stateProvider'];
  function routeConfig($stateProvider) {
    // Estimates state routing
    $stateProvider
      .state('estimates', {
        abstract: true,
        url: '/estimates',
        template: '<ui-view/>'
      })
      .state('estimates.list', {
        url: '',
        templateUrl: 'modules/estimates/client/views/list-estimates.client.view.html'
      })
      .state('estimates.create', {
        url: '/create',
        templateUrl: 'modules/estimates/client/views/create-estimate.client.view.html',
        data: {
          roles: ['driver', 'admin']
        },
      })
      .state('estimates.view', {
        url: '/:estimateId',
        templateUrl: 'modules/estimates/client/views/view-estimate.client.view.html'
      })
      .state('estimates.edit', {
        url: '/:estimateId/edit',
        templateUrl: 'modules/estimates/client/views/edit-estimate.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
  newEstimate.$inject = ['EstimatesService'];

  function newEstimate(EstimatesService) {
    return new EstimatesService();
  }
}());

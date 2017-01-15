(function () {
  'use strict';

  angular
    .module('estimatenews')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('estimatenews', {
        abstract: true,
        url: '/estimatenews',
        template: '<ui-view/>'
      })
      .state('estimatenews.list', {
        url: '',
        templateUrl: 'modules/estimatenews/client/views/list-estimatenews.client.view.html',
        controller: 'EstimatenewsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin','driver'],
          pageTitle: 'Estimatenews List'
        }
      })
      .state('estimatenews.create', {
        url: '/create',
        templateUrl: 'modules/estimatenews/client/views/form-estimatenew.client.view.html',
        controller: 'EstimatenewsController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: newEstimatenew
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Estimatenews Create'
        }
      })
      .state('estimatenews.edit', {
        url: '/:estimatenewId/edit',
        templateUrl: 'modules/estimatenews/client/views/form-estimatenew.client.view.html',
        controller: 'EstimatenewsController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: getEstimatenew
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Estimatenew {{ estimatenewResolve.name }}'
        }
      })
      .state('estimatenews.view', {
        url: '/:estimatenewId',
        templateUrl: 'modules/estimatenews/client/views/view-estimatenew.client.view.html',
        controller: 'EstimatenewsController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: getEstimatenew
        },
        data: {
          pageTitle: 'Estimatenew {{ estimatenewResolve.name }}'
        }
      });
  }

  getEstimatenew.$inject = ['$stateParams', 'EstimatenewsService'];

  function getEstimatenew($stateParams, EstimatenewsService) {
    return EstimatenewsService.get({
      estimatenewId: $stateParams.estimatenewId
    }).$promise;
  }

  newEstimatenew.$inject = ['EstimatenewsService'];

  function newEstimatenew(EstimatenewsService) {
    return new EstimatenewsService();
  }
}());

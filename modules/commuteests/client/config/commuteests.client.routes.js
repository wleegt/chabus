(function () {
  'use strict';

  angular
    .module('commuteests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('commuteests', {
        abstract: true,
        url: '/commuteests',
        template: '<ui-view/>'
      })
      .state('commuteests.list', {
        url: '',
        templateUrl: 'modules/commuteests/client/views/list-commuteests.client.view.html',
        controller: 'CommuteestsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Commuteests List'
        }
      })
      .state('commuteests.create', {
        url: '/create',
        templateUrl: 'modules/commuteests/client/views/form-commuteest.client.view.html',
        controller: 'CommuteestsController',
        controllerAs: 'vm',
        resolve: {
          commuteestResolve: newCommuteest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Commuteests Create'
        }
      })
      .state('commuteests.edit', {
        url: '/:commuteestId/edit',
        templateUrl: 'modules/commuteests/client/views/form-commuteest.client.view.html',
        controller: 'CommuteestsController',
        controllerAs: 'vm',
        resolve: {
          commuteestResolve: getCommuteest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Commuteest {{ commuteestResolve.name }}'
        }
      })
      .state('commuteests.view', {
        url: '/:commuteestId',
        templateUrl: 'modules/commuteests/client/views/view-commuteest.client.view.html',
        controller: 'CommuteestsController',
        controllerAs: 'vm',
        resolve: {
          commuteestResolve: getCommuteest
        },
        data: {
          pageTitle: 'Commuteest {{ commuteestResolve.name }}'
        }
      });
  }

  getCommuteest.$inject = ['$stateParams', 'CommuteestsService'];

  function getCommuteest($stateParams, CommuteestsService) {
    return CommuteestsService.get({
      commuteestId: $stateParams.commuteestId
    }).$promise;
  }

  newCommuteest.$inject = ['CommuteestsService'];

  function newCommuteest(CommuteestsService) {
    return new CommuteestsService();
  }
}());

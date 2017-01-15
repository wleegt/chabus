(function () {
  'use strict';

  angular
    .module('movinglines')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('movinglines', {
        abstract: true,
        url: '/movinglines',
        template: '<ui-view/>'
      })
      .state('movinglines.list', {
        url: '',
        templateUrl: 'modules/movinglines/client/views/list-movinglines.client.view.html',
        controller: 'MovinglinesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Movinglines List'
        }
      })
      .state('movinglines.create', {
        url: '/create',
        templateUrl: 'modules/movinglines/client/views/form-movingline.client.view.html',
        controller: 'MovinglinesController',
        controllerAs: 'vm',
        resolve: {
          movinglineResolve: newMovingline
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Movinglines Create'
        }
      })
      .state('movinglines.edit', {
        url: '/:movinglineId/edit',
        templateUrl: 'modules/movinglines/client/views/form-movingline.client.view.html',
        controller: 'MovinglinesController',
        controllerAs: 'vm',
        resolve: {
          movinglineResolve: getMovingline
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Movingline {{ movinglineResolve.name }}'
        }
      })
      .state('movinglines.view', {
        url: '/:movinglineId',
        templateUrl: 'modules/movinglines/client/views/view-movingline.client.view.html',
        controller: 'MovinglinesController',
        controllerAs: 'vm',
        resolve: {
          movinglineResolve: getMovingline
        },
        data: {
          pageTitle: 'Movingline {{ movinglineResolve.name }}'
        }
      });
  }

  getMovingline.$inject = ['$stateParams', 'MovinglinesService'];

  function getMovingline($stateParams, MovinglinesService) {
    return MovinglinesService.get({
      movinglineId: $stateParams.movinglineId
    }).$promise;
  }

  newMovingline.$inject = ['MovinglinesService'];

  function newMovingline(MovinglinesService) {
    return new MovinglinesService();
  }
}());

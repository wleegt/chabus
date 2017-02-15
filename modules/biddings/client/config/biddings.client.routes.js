(function () {
  'use strict';

  angular
    .module('biddings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('biddings', {
        abstract: true,
        url: '/biddings',
        template: '<ui-view/>'
      })
      .state('biddings.list', {
        url: '',
        templateUrl: 'modules/biddings/client/views/list-biddings.client.view.html',
        controller: 'BiddingsListController',
        controllerAs: 'vm',
        data: {
          roles: ['person', 'admin', 'driver'],
          pageTitle: 'Biddings List'
        }
      })
      .state('biddings.create', {
        url: '/create',
        templateUrl: 'modules/biddings/client/views/form-bidding.client.view.html',
        controller: 'BiddingsController',
        controllerAs: 'vm',
        resolve: {
          biddingResolve: newBidding
        },
        data: {
          roles: ['driver', 'admin'],
          pageTitle: 'Biddings Create'
        }
      })
      .state('biddings.edit', {
        url: '/:biddingId/edit',
        templateUrl: 'modules/biddings/client/views/form-bidding.client.view.html',
        controller: 'BiddingsController',
        controllerAs: 'vm',
        resolve: {
          biddingResolve: getBidding
        },
        data: {
          roles: ['driver', 'admin'],
          pageTitle: 'Edit Bidding'
        }
      })
      .state('biddings.view', {
        url: '/:biddingId',
        templateUrl: 'modules/biddings/client/views/view-bidding.client.view.html',
        controller: 'BiddingsController',
        controllerAs: 'vm',
        resolve: {
          biddingResolve: getBidding
        },
        data: {
          roles: ['driver', 'admin'],
          pageTitle: 'Bidding view'
        }
      });
  }

  getBidding.$inject = ['$stateParams', 'BiddingsService'];

  function getBidding($stateParams, BiddingsService) {
    return BiddingsService.get({
      biddingId: $stateParams.biddingId
    }).$promise;
  }

  newBidding.$inject = ['BiddingsService'];

  function newBidding(BiddingsService) {
    return new BiddingsService();
  }
}());

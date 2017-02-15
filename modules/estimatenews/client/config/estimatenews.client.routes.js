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
          roles: ['person', 'driver', 'admin'],
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
          roles: ['person', 'admin'],
          pageTitle: 'Estimatenews Create'
        }
      })
      .state('estimatenews.createbidding', {
        url: '/:estimatenewId/createbidding',
        templateUrl: 'modules/estimatenews/client/views/create-bidding.client.view.html',
        controller: 'BiddingCreateController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: getEstimatenew,
          biddingResolve: newBidding
        },
        data: {
          roles: ['admin', 'driver'],
          pageTitle: 'Bidding Create'
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
          roles: ['person', 'admin'],
          pageTitle: 'Edit Estimatenew'
        }
      })
      .state('estimatenews.editbidding', {
        url: '/:estimatenewId/editbidding/:biddingId',
        templateUrl: 'modules/estimatenews/client/views/create-bidding.client.view.html',
        controller: 'BiddingCreateController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: getEstimatenew,
          biddingResolve: getBidding
        },
        data: {
          roles: ['admin', 'driver'],
          pageTitle: 'Edit Bidding'
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
          roles: ['person', 'driver', 'admin'],
          pageTitle: 'Estimatenew view'
        }
      })
      .state('estimatenews.viewbidding', {
        url: '/:estimatenewId/viewbidding/:biddingId',
        templateUrl: 'modules/estimatenews/client/views/view-bidding.client.view.html',
        controller: 'BiddingCreateController',
        controllerAs: 'vm',
        resolve: {
          estimatenewResolve: getEstimatenew,
          biddingResolve: getBidding
        },
        data: {
          roles: ['driver', 'admin'],
          pageTitle: 'Bidding view'
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

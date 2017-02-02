(function () {
  'use strict';

  angular
    .module('estimatenews')
    .controller('BiddingCreateController', BiddingCreateController);

  BiddingCreateController.$inject = ['$scope', '$state', '$window', 'Authentication', 'estimatenewResolve', 'biddingResolve'];

  function BiddingCreateController($scope, $state, $window, Authentication, estimatenew, bidding) {
    var vm = this;

    vm.user = Authentication.user;
    vm.authentication = Authentication;
    vm.estimatenew1 = _.omit(estimatenew, ['phone']);

    vm.bidding = bidding;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Bidding
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.biddingForm');
        return false;
      }

      vm.bidding.estimatenewId = vm.estimatenew1._id;

      // TODO: move create/update logic to service
      if (vm.bidding._id) {
        vm.bidding.$update(successCallback, errorCallback);
      } else {
        vm.bidding.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.go('biddings.view', {
        //   biddingId: res._id
        // });
        console.log('success, bidingId: ' + res._id);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
}());

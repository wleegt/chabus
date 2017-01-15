(function () {
  'use strict';

  // Biddings controller
  angular
    .module('biddings')
    .controller('BiddingsController', BiddingsController);

  BiddingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'biddingResolve'];

  function BiddingsController ($scope, $state, $window, Authentication, bidding) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bidding = bidding;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bidding
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.bidding.$remove($state.go('biddings.list'));
      }
    }

    // Save Bidding
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.biddingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bidding._id) {
        vm.bidding.$update(successCallback, errorCallback);
      } else {
        vm.bidding.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('biddings.view', {
          biddingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

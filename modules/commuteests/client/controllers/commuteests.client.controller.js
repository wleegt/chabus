(function () {
  'use strict';

  // Commuteests controller
  angular
    .module('commuteests')
    .controller('CommuteestsController', CommuteestsController);

  CommuteestsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'commuteestResolve'];

  function CommuteestsController ($scope, $state, $window, Authentication, commuteest) {
    var vm = this;

    vm.authentication = Authentication;
    vm.commuteest = commuteest;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Commuteest
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.commuteest.$remove($state.go('commuteests.list'));
      }
    }

    // Save Commuteest
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commuteestForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.commuteest._id) {
        vm.commuteest.$update(successCallback, errorCallback);
      } else {
        vm.commuteest.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('commuteests.view', {
          commuteestId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

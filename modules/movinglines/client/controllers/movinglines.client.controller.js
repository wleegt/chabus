(function () {
  'use strict';

  // Movinglines controller
  angular
    .module('movinglines')
    .controller('MovinglinesController', MovinglinesController);

  MovinglinesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'movinglineResolve'];

  function MovinglinesController ($scope, $state, $window, Authentication, movingline) {
    var vm = this;

    vm.authentication = Authentication;
    vm.movingline = movingline;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Movingline
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.movingline.$remove($state.go('movinglines.list'));
      }
    }

    // Save Movingline
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.movinglineForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.movingline._id) {
        vm.movingline.$update(successCallback, errorCallback);
      } else {
        vm.movingline.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('movinglines.view', {
          movinglineId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

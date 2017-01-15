(function () {
  'use strict';

  // Estimatenews controller
  angular
    .module('estimatenews')
    .controller('EstimatenewsController', EstimatenewsController);

  EstimatenewsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'estimatenewResolve'];

  function EstimatenewsController ($scope, $state, $window, Authentication, estimatenew) {
    var vm = this;
    vm.user=Authentication.user;

    vm.authentication = Authentication;
    vm.estimatenew = estimatenew;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Estimatenew
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.estimatenew.$remove($state.go('estimatenews.list'));
      }
    }

    // Save Estimatenew
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.estimatenewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.estimatenew._id) {
        vm.estimatenew.$update(successCallback, errorCallback);
      } else {
        vm.estimatenew.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('estimatenews.view', {
          estimatenewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Customize below

    // Init select-options in create view

    // $scope.isturnback = $scope.isturnback || true;
    // $scope.preferedbus = $scope.preferedbus || '상관없음';

    // Datepicker & timepicker
    // $scope.minDate1 = new Date();
    //
    // $scope.open1 = function() {
    //   $scope.opened1 = true;
    // };
    //
    // $scope.open2 = function() {
    //   $scope.opened2 = true;
    // };
    //
    // $scope.dateOptions = {
    //   formatYear: 'yy',
    //   startingDay: 1,
    //   showWeeks: false
    // };
    //
    // $scope.hours = ['자정', '오전 1시', '오전 2시', '오전 3시', '오전 4시', '오전 5시',
    //                 '오전 6시', '오전 7시', '오전 8시', '오전 9시', '오전 10시', '오전 11시',
    //                 '정오', '오후 1시', '오후 2시','오후 3시','오후 4시','오후 5시',
    //                 '오후 6시', '오후 7시','오후 8시', '오후 9시', '오후 10시', '오후 11시'];
    //
    // $scope.$watchCollection('[dt1, tm1]', function(newValues, oldValues) {
    //   $scope.startdatetime = $filter('date')(newValues[0], 'fullDate') + ' ' + newValues[1];
    // });
    //
    // $scope.$watchCollection('[dt2, tm2]', function(newValues, oldValues) {
    //   $scope.enddatetime = $filter('date')(newValues[0], 'fullDate') + ' ' + newValues[1];
    // });
    //
    // $scope.$watch('isturnback', function(newValue, oldValue) {
    //   if (!newValue) {
    //     $scope.enddatetime = 'NA';
    //   }
    // });
    //
    // $scope.tripGoals = ['결혼식', '야유회', '워크샵', '산악회', 'MT', '단체관람', '기타'];
    //

  }
}());

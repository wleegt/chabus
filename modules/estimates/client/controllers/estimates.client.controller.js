'use strict';

// Estimates controller
angular.module('estimates').controller('EstimatesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'EstimatesService',
  function ($scope, $stateParams, $location, $filter, Authentication, EstimatesService) {
    $scope.authentication = Authentication;
    $scope.shownhide=authentication.user._id == estimate.user._id;
    // Create new Estimate
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'estimateForm');

        return false;
      }

      // Create new Estimate object
      var estimate = new EstimatesService({
        startposition: this.startposition,
        endposition: this.endposition,
        isturnback: this.isturnback,
        startdatetime: this.startdatetime,
        enddatetime: this.enddatetime,
        message: this.message
      });

      // Redirect after save
      estimate.$save(function (response) {
        $location.path('estimates/' + response._id);

        // Clear form fields
        $scope.startposition = '';
        $scope.endposition = '';
        $scope.isturnback = true;
        $scope.startdatetime = '';
        $scope.enddatetime = '';
        $scope.message = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Estimate
    $scope.remove = function (estimate) {
      if (estimate) {
        estimate.$remove();

        for (var i in $scope.estimates) {
          if ($scope.estimates[i] === estimate) {
            $scope.estimates.splice(i, 1);
          }
        }
      } else {
        $scope.estimate.$remove(function () {
          $location.path('estimates');
        });
      }
    };

    // Update existing Estimate
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'estimateForm');

        return false;
      }

      var estimate = $scope.estimate;

      estimate.$update(function () {
        $location.path('estimates/' + estimate._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Estimates
    $scope.find = function () {
      $scope.estimates = EstimatesService.query();
    };

    // Find existing Estimate
    $scope.findOne = function () {
      $scope.estimate = EstimatesService.get({
        estimateId: $stateParams.estimateId
      });
    };

    // Customize below

    // Init select-options in create view

    $scope.isturnback = $scope.isturnback || true;
    $scope.preferedbus = $scope.preferedbus || '상관없음';

    // Datepicker & timepicker
    $scope.minDate1 = new Date();

    $scope.open1 = function() {
      $scope.opened1 = true;
    };

    $scope.open2 = function() {
      $scope.opened2 = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false
    };

    $scope.hours = ['자정', '오전 1시', '오전 2시', '오전 3시', '오전 4시', '오전 5시',
                    '오전 6시', '오전 7시', '오전 8시', '오전 9시', '오전 10시', '오전 11시',
                    '정오', '오후 1시', '오후 2시','오후 3시','오후 4시','오후 5시',
                    '오후 6시', '오후 7시','오후 8시', '오후 9시', '오후 10시', '오후 11시'];

    $scope.$watchCollection('[dt1, tm1]', function(newValues, oldValues) {
      $scope.startdatetime = $filter('date')(newValues[0], 'fullDate') + ' ' + newValues[1];
    });

    $scope.$watchCollection('[dt2, tm2]', function(newValues, oldValues) {
      $scope.enddatetime = $filter('date')(newValues[0], 'fullDate') + ' ' + newValues[1];
    });

    $scope.$watch('isturnback', function(newValue, oldValue) {
      if (!newValue) {
        $scope.enddatetime = 'NA';
      }
    });

    $scope.tripGoals = ['결혼식', '야유회', '워크샵', '산악회', 'MT', '단체관람', '기타'];

  }
]);

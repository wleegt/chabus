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
    // vm.estimatenew = _.omit(estimatenew, ['phone']);
    vm.estimatenew = estimatenew;

    vm.bidding = bidding;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bidding
    function remove() {
      if ($window.confirm('정말 삭제하겠습니까?')) {
        vm.bidding.$remove($state.go('estimatenews.list'));
      }
    }

    // Save Bidding
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.biddingForm');
        return false;
      }

      vm.bidding.estimatenewId = vm.estimatenew._id;

      // TODO: move create/update logic to service
      if (vm.bidding._id) {
        vm.bidding.$update(successCallbackUpdate, errorCallback);
      } else {
        vm.bidding.$save(successCallbackSave, errorCallback);
      }

      function successCallbackSave(res) {
        vm.estimatenew.biddingby.push(vm.user._id);
        vm.estimatenew.$update(function() {
          // console.log('bidding user id added');
          $state.go('estimatenews.list');
        }, function() {
          console.log('bidding user id NOT added!');
        });
      }

      function successCallbackUpdate(res) {
        // $state.go('estimatenews.view', {
        //   estimatenewId: res.estimatenewId,
        //   biddingId: res._id
        // });
        $state.go('estimatenews.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    ///
    $scope.dateDiff = function(date1Str, date2Str) {
      if (date2Str === null) {
        return '';
      } else {
        var date1 = new Date(Date.parse(date1Str));
        var date2 = new Date(Date.parse(date2Str));
        var diffInDays = date2.getDate() - date1.getDate();
        var daysStr = diffInDays > 0 ? (diffInDays + '박' + (diffInDays + 1) +'일') : '당일';
        return daysStr;
      }
    };

  }
}());

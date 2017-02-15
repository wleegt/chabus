(function () {
  'use strict';

  angular
    .module('estimatenews')
    .controller('EstimatenewsListController', EstimatenewsListController);

  EstimatenewsListController.$inject = ['$scope', 'EstimatenewsService','Authentication'];

  function EstimatenewsListController($scope, EstimatenewsService, Authentication) {
    var vm = this;
    vm.user = Authentication.user;

    /// admin, driver은 전부 보여주고, person은 본인 것만 보여준다
    if(_.includes(vm.user.roles,'admin') || _.includes(vm.user.roles,'driver')) {
      vm.estimatenews = EstimatenewsService.query();
    } else if(_.includes(vm.user.roles,'person')) {
      vm.estimatenews = EstimatenewsService.query({user: vm.user._id});
    }


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

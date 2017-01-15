(function () {
  'use strict';

  angular
    .module('commuteests')
    .controller('CommuteestsListController', CommuteestsListController);

  CommuteestsListController.$inject = ['CommuteestsService'];

  function CommuteestsListController(CommuteestsService) {
    var vm = this;

    vm.commuteests = CommuteestsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('biddings')
    .controller('BiddingsListController', BiddingsListController);

  BiddingsListController.$inject = ['BiddingsService'];

  function BiddingsListController(BiddingsService) {
    var vm = this;

    vm.biddings = BiddingsService.query();
  }
}());

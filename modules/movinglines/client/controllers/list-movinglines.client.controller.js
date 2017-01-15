(function () {
  'use strict';

  angular
    .module('movinglines')
    .controller('MovinglinesListController', MovinglinesListController);

  MovinglinesListController.$inject = ['MovinglinesService'];

  function MovinglinesListController(MovinglinesService) {
    var vm = this;

    vm.movinglines = MovinglinesService.query();
  }
}());

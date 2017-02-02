(function () {
  'use strict';

  angular
    .module('estimatenews')
    .controller('EstimatenewsListController', EstimatenewsListController);

  EstimatenewsListController.$inject = ['EstimatenewsService','Authentication','BiddingsService'];

  function EstimatenewsListController(EstimatenewsService,Authentication,BiddingsService) {
    var vm = this;
    vm.user = Authentication.user;

    /// 어드민은 전부 보여주고, 유저는 본인 것만 보여준다. query
    if(_.includes(vm.user.roles,'admin')){
      // console.log('user is admin');
      vm.estimatenews = EstimatenewsService.query(); //admin
    } else if(_.includes(vm.user.roles,'driver')){
      console.log('driver is 일반');
      vm.estimatenews = EstimatenewsService.query({kindofest: true});
    } else if(_.includes(vm.user.roles,'comdriver')){
      console.log('driver is 통근');
      vm.estimatenews = EstimatenewsService.query({kindofest: false});
    } else {
      // console.log('user');
      vm.estimatenews = EstimatenewsService.query({user: vm.user._id}); //user
    }
    // vm.estimatenews.$promise.then(function(result){
    //   console.log(result[0])
    // });
    // console.log(vm.estimatenews[0]);

    // vm.biddingclick = function(num) {
    //   console.log('index: ' + num);
    // };

  }
}());

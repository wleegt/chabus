(function () {
  'use strict';

  // Estimatenews controller
  angular
    .module('estimatenews')
    .controller('EstimatenewsController', EstimatenewsController);

  EstimatenewsController.$inject = ['$scope', '$state', '$window',  '$filter', 'Authentication', 'estimatenewResolve', 'BiddingsService'];

  function EstimatenewsController ($scope, $state, $window, $filter, Authentication, estimatenew, BiddingsService) {
    var vm = this;
    vm.user = Authentication.user; ///
    vm.authentication = Authentication;
    vm.estimatenew = estimatenew;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.removebidding = removebidding;
    vm.book = book;

    vm.estimatenew.isturnback = vm.estimatenew.isturnback || '왕복'; ///
    vm.estimatenew.preferedbus = vm.estimatenew.preferedbus || '상관없음'; ///

    /// admin, person은 연결된 입찰 전부 보여주고, driver는 본인 입찰만 보여준다
    if(_.includes(vm.user.roles,'admin') || _.includes(vm.user.roles,'person')) {
      vm.biddings = BiddingsService.query({estimatenewId: vm.estimatenew._id});
    } else if(_.includes(vm.user.roles,'driver')) {
      vm.biddings = BiddingsService.query({user: vm.user._id, estimatenewId: vm.estimatenew._id});
    }


    $scope.dateDiff = function(date1Str, date2Str) {
      var date1 = new Date(Date.parse(date1Str));
      var date2 = new Date(Date.parse(date2Str));
      var diffInDays = date2.getDate() - date1.getDate();
      var daysStr = diffInDays > 0 ? (diffInDays + '박' + (diffInDays + 1) +'일') : 'N/A';
      return daysStr;
    };

    // Remove existing Estimatenew
    function remove() {
      if ($window.confirm('정말 삭제하겠습니까?')) {
        vm.estimatenew.$remove(function() {
          $state.go('estimatenews.list');
          vm.biddings.$promise.then(function(biddings) {
            angular.forEach(biddings, function(value, key){
              value.$remove();
            });
          });
        }, function() {
          console.log('estimatenew remove failed!');
        });
      }
    }

    // Remove existing bidding
    function removebidding(id) {
      if ($window.confirm('정말 삭제하겠습니까?')) {
        vm.biddings.$promise.then(function(biddings) {
          var selectedbid = _.find(biddings, {_id: id});
          if (selectedbid._id) {
            selectedbid.$remove(function() {
              //remove bidding driver user id in estimatenew
              vm.estimatenew.biddingby = _.without(vm.estimatenew.biddingby, selectedbid.user._id);
              vm.estimatenew.$update(function() {
                // console.log('bidding user id removed');
              }, function() {
                console.log('bidding user id NOT removed!');
              });
              $state.go('estimatenews.list');
            }, function() {
              console.log('bidding remove failed!');
            });
          }
        });
      }
    }

    // 기사님과 예약하기
    function book(id) {
      BiddingsService.query({_id: id}).$promise.then(function(biddings) {
        if (vm.estimatenew.bookingwith === '') {
          var selectedbid = biddings[0];
          if (selectedbid._id) {
            selectedbid.isbooked = true;
            selectedbid.$update(function() {
              // console.log('booking succeeded');
            }, function() {
              console.log('booking failed!');
            });
            //update booking driver user id in estimatenew
            vm.estimatenew.bookingwith = selectedbid.user._id;
            vm.estimatenew.$update(function() {
              // console.log('booking driver user id updated in estimatenew');
              console.log(vm.estimatenew.bookingwith);
            }, function() {
              console.log('booking driver user id update failed!');
            });
          } else {
            if ($window.confirm('이 기사님이 입찰을 취소했습니다. 다른 입찰을 선택하세요.')) {
              // $state.go('estimatenews.view', {
              //   estimatenewId: res.estimatenewId,
              //   biddingId: res._id
              // });
              $state.go('estimatenews.list');
            }
          }
        } else {
          // booked already..
        }
      });
    }

    // Save Estimatenew
    function save(isValid) {

      if (vm.estimatenew.isturnback === '편도') {
        vm.estimatenew.enddate = null;
        vm.estimatenew.endtime = '';
      } ///

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

    ///
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
    $scope.tripGoals = ['결혼식', '야유회', '워크샵', '산악회', 'MT', '단체관람', '기타'];

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

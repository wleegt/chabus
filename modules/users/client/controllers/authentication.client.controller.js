'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$stateParams', '$http', '$location', '$window', '$timeout', 'Authentication', 'PasswordValidator', 'Upload', 'Notification',
  function ($scope, $state, $stateParams, $http, $location, $window, $timeout, Authentication, PasswordValidator, Upload, Notification) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    /// state parameter for sign up page
    $scope.signupfor = $stateParams.signupfor;
    $scope.busTypes = ['45인승 버스', '45인승 리무진', '35인승 버스', '28인승 우등 리무진', '28인승 우등 싸롱', '25인승 선롱', '25인승 카운티', '20인승 미니우등', '17인승 미니우등'];
    $scope.busYears = ['2017년식', '2016년식', '2015년식', '2014년식', '2013년식', '2012년식', '2011년식', '2010년식', '2009년식', '2008년식'];
    $scope.busYears1 = ['운영안함', '1년 이내', '2년 이내', '3년 이내', '4년 이내', '5년 이내', '6년 이내', '7년 이내', '8년 이내'];

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }


      $http.post('/api/auth/signup', {credentials: $scope.credentials, signupfor: $scope.signupfor}).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        ///
        $scope.uploadAllPics($scope.picFiles);

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    /// upload pictures
    $scope.progress = 0;
    // $scope.defaultProfileImage = '/modules/users/client/img/profile/default.png';
    $scope.defaultProfileImage = function() {
      return ($stateParams.signupfor === 'driver') ? '/modules/users/client/img/custom/defaultDriver.png' : (($stateParams.signupfor === 'comdriver') ? '/modules/users/client/img/custom/defaultCompany.png' : '/modules/users/client/img/custom/defaultUser.png');
    };
    $scope.defaultBusImage = '/modules/users/client/img/custom/defaultBus.png';
    $scope.defaultCameraImage = '/modules/users/client/img/custom/defaultCamera.png';
    $scope.busImageAlts = ['차량 정면', '좌석 전체', '좌석 옆면', '좌석 뒷면', '운전석 뒷면'];

    $scope.picFiles = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    $scope.fileSelected = [false, false, false, false, false, false, false, false];
    $scope.loading = [false, false, false, false, false, false, false, false];
    $scope.showLoadingProgress = false;


    $scope.uploadAllPics = function (data) {
      /// find picFiles to upload
      var dataUrls = [];
      var dataIndices = [];
      angular.forEach($scope.picFiles, function(value, key) {
        if (value !== undefined) {
          dataUrls.push(value);
          dataIndices.push(key);
        }
      });

      /// upload picFiles and send index array
      if (dataUrls && dataUrls.length) {
        $scope.showLoadingProgress = true;
        Upload.upload({
          url: '/api/users/buspicture',
          arrayKey: '',
          data: {
            newBusPicture: dataUrls,
            'picIndex': dataIndices
          }
        }).then(function (response) {
          $timeout(function () {
            onSuccessItem(response.data);
          });
        }, function (response) {
          if (response.status > 0) onErrorItem(response.data);
        }, function (evt) {
          $scope.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
        });
      }
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully uploaded pictures' });

      // Populate user object
      $scope.user = Authentication.user = response;

      // Reset form
      $scope.fileSelected = [false, false, false, false, false, false, false, false];
      $scope.picFiles = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
      $scope.progress = 0;
      $scope.showLoadingProgress = false;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      $scope.fileSelected = [false, false, false, false, false, false, false, false];
      $scope.picFiles = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
      $scope.progress = 0;
      $scope.showLoadingProgress = false;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to upload pictures' });
    }

    $scope.selectPic = function(i) {
      $scope.fileSelected[i] = true;
      $scope.loading[i] = false;
    };

    $scope.cancelPic = function(i) {
      $scope.picFiles[i] = undefined;
      $scope.fileSelected[i] = false;
    };

  }
]);

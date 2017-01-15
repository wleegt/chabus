'use strict';

(function () {
  // Estimates Controller Spec
  describe('Estimates Controller Tests', function () {
    // Initialize global variables
    var EstimatesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Estimates,
      mockEstimate;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Estimates_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Estimates = _Estimates_;

      // create mock estimate
      mockEstimate = new Estimates({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Estimate about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Estimates controller.
      EstimatesController = $controller('EstimatesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one estimate object fetched from XHR', inject(function (Estimates) {
      // Create a sample estimates array that includes the new estimate
      var sampleEstimates = [mockEstimate];

      // Set GET response
      $httpBackend.expectGET('api/estimates').respond(sampleEstimates);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.estimates).toEqualData(sampleEstimates);
    }));

    it('$scope.findOne() should create an array with one estimate object fetched from XHR using a estimateId URL parameter', inject(function (Estimates) {
      // Set the URL parameter
      $stateParams.estimateId = mockEstimate._id;

      // Set GET response
      $httpBackend.expectGET(/api\/estimates\/([0-9a-fA-F]{24})$/).respond(mockEstimate);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.estimate).toEqualData(mockEstimate);
    }));

    describe('$scope.create()', function () {
      var sampleEstimatePostData;

      beforeEach(function () {
        // Create a sample estimate object
        sampleEstimatePostData = new Estimates({
          title: 'An Estimate about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Estimate about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Estimates) {
        // Set POST response
        $httpBackend.expectPOST('api/estimates', sampleEstimatePostData).respond(mockEstimate);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the estimate was created
        expect($location.path.calls.mostRecent().args[0]).toBe('estimates/' + mockEstimate._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/estimates', sampleEstimatePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock estimate in scope
        scope.estimate = mockEstimate;
      });

      it('should update a valid estimate', inject(function (Estimates) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/estimates\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/estimates/' + mockEstimate._id);
      }));

      it('should set scope.error to error response message', inject(function (Estimates) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/estimates\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(estimate)', function () {
      beforeEach(function () {
        // Create new estimates array and include the estimate
        scope.estimates = [mockEstimate, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/estimates\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockEstimate);
      });

      it('should send a DELETE request with a valid estimateId and remove the estimate from the scope', inject(function (Estimates) {
        expect(scope.estimates.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.estimate = mockEstimate;

        $httpBackend.expectDELETE(/api\/estimates\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to estimates', function () {
        expect($location.path).toHaveBeenCalledWith('estimates');
      });
    });
  });
}());

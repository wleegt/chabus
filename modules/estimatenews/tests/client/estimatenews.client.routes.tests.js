(function () {
  'use strict';

  describe('Estimatenews Route Tests', function () {
    // Initialize global variables
    var $scope,
      EstimatenewsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EstimatenewsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EstimatenewsService = _EstimatenewsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('estimatenews');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/estimatenews');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EstimatenewsController,
          mockEstimatenew;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('estimatenews.view');
          $templateCache.put('modules/estimatenews/client/views/view-estimatenew.client.view.html', '');

          // create mock Estimatenew
          mockEstimatenew = new EstimatenewsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Estimatenew Name'
          });

          // Initialize Controller
          EstimatenewsController = $controller('EstimatenewsController as vm', {
            $scope: $scope,
            estimatenewResolve: mockEstimatenew
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:estimatenewId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.estimatenewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            estimatenewId: 1
          })).toEqual('/estimatenews/1');
        }));

        it('should attach an Estimatenew to the controller scope', function () {
          expect($scope.vm.estimatenew._id).toBe(mockEstimatenew._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/estimatenews/client/views/view-estimatenew.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EstimatenewsController,
          mockEstimatenew;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('estimatenews.create');
          $templateCache.put('modules/estimatenews/client/views/form-estimatenew.client.view.html', '');

          // create mock Estimatenew
          mockEstimatenew = new EstimatenewsService();

          // Initialize Controller
          EstimatenewsController = $controller('EstimatenewsController as vm', {
            $scope: $scope,
            estimatenewResolve: mockEstimatenew
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.estimatenewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/estimatenews/create');
        }));

        it('should attach an Estimatenew to the controller scope', function () {
          expect($scope.vm.estimatenew._id).toBe(mockEstimatenew._id);
          expect($scope.vm.estimatenew._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/estimatenews/client/views/form-estimatenew.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EstimatenewsController,
          mockEstimatenew;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('estimatenews.edit');
          $templateCache.put('modules/estimatenews/client/views/form-estimatenew.client.view.html', '');

          // create mock Estimatenew
          mockEstimatenew = new EstimatenewsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Estimatenew Name'
          });

          // Initialize Controller
          EstimatenewsController = $controller('EstimatenewsController as vm', {
            $scope: $scope,
            estimatenewResolve: mockEstimatenew
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:estimatenewId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.estimatenewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            estimatenewId: 1
          })).toEqual('/estimatenews/1/edit');
        }));

        it('should attach an Estimatenew to the controller scope', function () {
          expect($scope.vm.estimatenew._id).toBe(mockEstimatenew._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/estimatenews/client/views/form-estimatenew.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

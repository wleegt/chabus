(function () {
  'use strict';

  describe('Commuteests Route Tests', function () {
    // Initialize global variables
    var $scope,
      CommuteestsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CommuteestsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CommuteestsService = _CommuteestsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('commuteests');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/commuteests');
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
          CommuteestsController,
          mockCommuteest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('commuteests.view');
          $templateCache.put('modules/commuteests/client/views/view-commuteest.client.view.html', '');

          // create mock Commuteest
          mockCommuteest = new CommuteestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Commuteest Name'
          });

          // Initialize Controller
          CommuteestsController = $controller('CommuteestsController as vm', {
            $scope: $scope,
            commuteestResolve: mockCommuteest
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:commuteestId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.commuteestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            commuteestId: 1
          })).toEqual('/commuteests/1');
        }));

        it('should attach an Commuteest to the controller scope', function () {
          expect($scope.vm.commuteest._id).toBe(mockCommuteest._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/commuteests/client/views/view-commuteest.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CommuteestsController,
          mockCommuteest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('commuteests.create');
          $templateCache.put('modules/commuteests/client/views/form-commuteest.client.view.html', '');

          // create mock Commuteest
          mockCommuteest = new CommuteestsService();

          // Initialize Controller
          CommuteestsController = $controller('CommuteestsController as vm', {
            $scope: $scope,
            commuteestResolve: mockCommuteest
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.commuteestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/commuteests/create');
        }));

        it('should attach an Commuteest to the controller scope', function () {
          expect($scope.vm.commuteest._id).toBe(mockCommuteest._id);
          expect($scope.vm.commuteest._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/commuteests/client/views/form-commuteest.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CommuteestsController,
          mockCommuteest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('commuteests.edit');
          $templateCache.put('modules/commuteests/client/views/form-commuteest.client.view.html', '');

          // create mock Commuteest
          mockCommuteest = new CommuteestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Commuteest Name'
          });

          // Initialize Controller
          CommuteestsController = $controller('CommuteestsController as vm', {
            $scope: $scope,
            commuteestResolve: mockCommuteest
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:commuteestId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.commuteestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            commuteestId: 1
          })).toEqual('/commuteests/1/edit');
        }));

        it('should attach an Commuteest to the controller scope', function () {
          expect($scope.vm.commuteest._id).toBe(mockCommuteest._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/commuteests/client/views/form-commuteest.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

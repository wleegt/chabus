(function () {
  'use strict';

  describe('Movinglines Route Tests', function () {
    // Initialize global variables
    var $scope,
      MovinglinesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MovinglinesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MovinglinesService = _MovinglinesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('movinglines');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/movinglines');
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
          MovinglinesController,
          mockMovingline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('movinglines.view');
          $templateCache.put('modules/movinglines/client/views/view-movingline.client.view.html', '');

          // create mock Movingline
          mockMovingline = new MovinglinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movingline Name'
          });

          // Initialize Controller
          MovinglinesController = $controller('MovinglinesController as vm', {
            $scope: $scope,
            movinglineResolve: mockMovingline
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:movinglineId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.movinglineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            movinglineId: 1
          })).toEqual('/movinglines/1');
        }));

        it('should attach an Movingline to the controller scope', function () {
          expect($scope.vm.movingline._id).toBe(mockMovingline._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/movinglines/client/views/view-movingline.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MovinglinesController,
          mockMovingline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('movinglines.create');
          $templateCache.put('modules/movinglines/client/views/form-movingline.client.view.html', '');

          // create mock Movingline
          mockMovingline = new MovinglinesService();

          // Initialize Controller
          MovinglinesController = $controller('MovinglinesController as vm', {
            $scope: $scope,
            movinglineResolve: mockMovingline
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.movinglineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/movinglines/create');
        }));

        it('should attach an Movingline to the controller scope', function () {
          expect($scope.vm.movingline._id).toBe(mockMovingline._id);
          expect($scope.vm.movingline._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/movinglines/client/views/form-movingline.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MovinglinesController,
          mockMovingline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('movinglines.edit');
          $templateCache.put('modules/movinglines/client/views/form-movingline.client.view.html', '');

          // create mock Movingline
          mockMovingline = new MovinglinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movingline Name'
          });

          // Initialize Controller
          MovinglinesController = $controller('MovinglinesController as vm', {
            $scope: $scope,
            movinglineResolve: mockMovingline
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:movinglineId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.movinglineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            movinglineId: 1
          })).toEqual('/movinglines/1/edit');
        }));

        it('should attach an Movingline to the controller scope', function () {
          expect($scope.vm.movingline._id).toBe(mockMovingline._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/movinglines/client/views/form-movingline.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

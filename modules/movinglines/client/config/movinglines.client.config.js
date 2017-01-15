(function () {
  'use strict';

  angular
    .module('movinglines')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Movinglines',
      state: 'movinglines',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'movinglines', {
      title: 'List Movinglines',
      state: 'movinglines.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'movinglines', {
      title: 'Create Movingline',
      state: 'movinglines.create',
      roles: ['user']
    });
  }
}());

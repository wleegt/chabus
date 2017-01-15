(function () {
  'use strict';

  angular
    .module('commuteests')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Commuteests',
      state: 'commuteests',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'commuteests', {
      title: 'List Commuteests',
      state: 'commuteests.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'commuteests', {
      title: 'Create Commuteest',
      state: 'commuteests.create',
      roles: ['user']
    });
  }
}());

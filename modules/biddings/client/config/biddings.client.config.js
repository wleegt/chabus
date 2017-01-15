(function () {
  'use strict';

  angular
    .module('biddings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Biddings',
      state: 'biddings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'biddings', {
      title: 'List Biddings',
      state: 'biddings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'biddings', {
      title: 'Create Bidding',
      state: 'biddings.create',
      roles: ['user']
    });
  }
}());

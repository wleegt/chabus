(function () {
  'use strict';

  angular
    .module('estimatenews')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Estimatenews',
      state: 'estimatenews',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: 'List Estimatenews',
      state: 'estimatenews.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: 'Create Estimatenew',
      state: 'estimatenews.create',
      roles: ['user']
    });
  }
}());

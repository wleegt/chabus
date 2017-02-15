(function () {
  'use strict';

  angular
    .module('estimatenews')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '전세버스 견적',
      state: 'estimatenews',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: '견적 리스트',
      state: 'estimatenews.list',
      roles: ['person', 'driver', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: '견적 신청',
      state: 'estimatenews.create',
      roles: ['person', 'admin']
    });
  }
}());

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
      title: '견적 리스트',
      state: 'estimatenews.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: '견적 신청',
      state: 'estimatenews.create',
      roles: ['user']
    });

    // Add the dropdown 입찰하기 item
    menuService.addSubMenuItem('topbar', 'estimatenews', {
      title: '입찰하기',
      state: 'estimatenews.createbidding',
      roles: ['driver', 'admin']
    });
  }
}());

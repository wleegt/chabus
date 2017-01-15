'use strict';

// Configuring the Estimates module
angular.module('estimates').run(['Menus',
  function (Menus) {
    // Add the estimates dropdown item
    // Menus.addMenuItem('topbar', {
    //   title: 'Estimates',
    //   state: 'estimates',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    //
    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'estimates', {
    //   title: 'List Estimates',
    //   state: 'estimates.list'
    // });
    //
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'estimates', {
    //   title: 'Create Estimates',
    //   state: 'estimates.create',
    //   roles: ['user']
    // });
  }
]);

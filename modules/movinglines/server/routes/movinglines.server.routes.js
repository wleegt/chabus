'use strict';

/**
 * Module dependencies
 */
var movinglinesPolicy = require('../policies/movinglines.server.policy'),
  movinglines = require('../controllers/movinglines.server.controller');

module.exports = function(app) {
  // Movinglines Routes
  app.route('/api/movinglines').all(movinglinesPolicy.isAllowed)
    .get(movinglines.list)
    .post(movinglines.create);

  app.route('/api/movinglines/:movinglineId').all(movinglinesPolicy.isAllowed)
    .get(movinglines.read)
    .put(movinglines.update)
    .delete(movinglines.delete);

  // Finish by binding the Movingline middleware
  app.param('movinglineId', movinglines.movinglineByID);
};

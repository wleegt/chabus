'use strict';

/**
 * Module dependencies
 */
var commuteestsPolicy = require('../policies/commuteests.server.policy'),
  commuteests = require('../controllers/commuteests.server.controller');

module.exports = function(app) {
  // Commuteests Routes
  app.route('/api/commuteests').all(commuteestsPolicy.isAllowed)
    .get(commuteests.list)
    .post(commuteests.create);

  app.route('/api/commuteests/:commuteestId').all(commuteestsPolicy.isAllowed)
    .get(commuteests.read)
    .put(commuteests.update)
    .delete(commuteests.delete);

  // Finish by binding the Commuteest middleware
  app.param('commuteestId', commuteests.commuteestByID);
};

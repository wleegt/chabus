'use strict';

/**
 * Module dependencies.
 */
var estimatesPolicy = require('../policies/estimates.server.policy'),
  estimates = require('../controllers/estimates.server.controller');

module.exports = function (app) {
  // Estimates collection routes
  app.route('/api/estimates').all(estimatesPolicy.isAllowed)
    .get(estimates.list)
    .post(estimates.create);

  // Single estimate routes
  app.route('/api/estimates/:estimateId').all(estimatesPolicy.isAllowed)
    .get(estimates.read)
    .put(estimates.update)
    .delete(estimates.delete);

  // Finish by binding the estimate middleware
  app.param('estimateId', estimates.estimateByID);
};

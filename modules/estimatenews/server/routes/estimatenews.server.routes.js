'use strict';

/**
 * Module dependencies
 */
var estimatenewsPolicy = require('../policies/estimatenews.server.policy'),
  estimatenews = require('../controllers/estimatenews.server.controller');

module.exports = function(app) {
  // Estimatenews Routes
  app.route('/api/estimatenews').all(estimatenewsPolicy.isAllowed)
    .get(estimatenews.list)
    .post(estimatenews.create);

  app.route('/api/estimatenews/:estimatenewId').all(estimatenewsPolicy.isAllowed)
    .get(estimatenews.read)
    .put(estimatenews.update)
    .delete(estimatenews.delete);

  // Finish by binding the Estimatenew middleware
  app.param('estimatenewId', estimatenews.estimatenewByID);
};

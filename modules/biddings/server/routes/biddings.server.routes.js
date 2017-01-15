'use strict';

/**
 * Module dependencies
 */
var biddingsPolicy = require('../policies/biddings.server.policy'),
  biddings = require('../controllers/biddings.server.controller');

module.exports = function(app) {
  // Biddings Routes
  app.route('/api/biddings').all(biddingsPolicy.isAllowed)
    .get(biddings.list)
    .post(biddings.create);

  app.route('/api/biddings/:biddingId').all(biddingsPolicy.isAllowed)
    .get(biddings.read)
    .put(biddings.update)
    .delete(biddings.delete);

  // Finish by binding the Bidding middleware
  app.param('biddingId', biddings.biddingByID);
};

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bidding = mongoose.model('Bidding'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bidding
 */
exports.create = function(req, res) {
  var bidding = new Bidding(req.body);
  bidding.user = req.user;

  bidding.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bidding);
    }
  });
};

/**
 * Show the current Bidding
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bidding = req.bidding ? req.bidding.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bidding.isCurrentUserOwner = req.user && bidding.user && bidding.user._id.toString() === req.user._id.toString() || _.includes(req.user.roles,'admin');

  res.jsonp(bidding);
};

/**
 * Update a Bidding
 */
exports.update = function(req, res) {
  var bidding = req.bidding;

  bidding = _.extend(bidding, req.body);

  bidding.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bidding);
    }
  });
};

/**
 * Delete an Bidding
 */
exports.delete = function(req, res) {
  var bidding = req.bidding;

  bidding.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bidding);
    }
  });
};

/**
 * List of Biddings
 */
exports.list = function(req, res) {
  Bidding.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, biddings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(biddings);
    }
  });
};

/**
 * Bidding middleware
 */
exports.biddingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bidding is invalid'
    });
  }

  Bidding.findById(id).populate('user', 'displayName').exec(function (err, bidding) {
    if (err) {
      return next(err);
    } else if (!bidding) {
      return res.status(404).send({
        message: 'No Bidding with that identifier has been found'
      });
    }
    req.bidding = bidding;
    next();
  });
};

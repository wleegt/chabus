'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Commuteest = mongoose.model('Commuteest'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Commuteest
 */
exports.create = function(req, res) {
  var commuteest = new Commuteest(req.body);
  commuteest.user = req.user;

  commuteest.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commuteest);
    }
  });
};

/**
 * Show the current Commuteest
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var commuteest = req.commuteest ? req.commuteest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  commuteest.isCurrentUserOwner = req.user && commuteest.user && commuteest.user._id.toString() === req.user._id.toString();

  res.jsonp(commuteest);
};

/**
 * Update a Commuteest
 */
exports.update = function(req, res) {
  var commuteest = req.commuteest;

  commuteest = _.extend(commuteest, req.body);

  commuteest.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commuteest);
    }
  });
};

/**
 * Delete an Commuteest
 */
exports.delete = function(req, res) {
  var commuteest = req.commuteest;

  commuteest.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commuteest);
    }
  });
};

/**
 * List of Commuteests
 */
exports.list = function(req, res) {
  Commuteest.find().sort('-created').populate('user', 'displayName').exec(function(err, commuteests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commuteests);
    }
  });
};

/**
 * Commuteest middleware
 */
exports.commuteestByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Commuteest is invalid'
    });
  }

  Commuteest.findById(id).populate('user', 'displayName').exec(function (err, commuteest) {
    if (err) {
      return next(err);
    } else if (!commuteest) {
      return res.status(404).send({
        message: 'No Commuteest with that identifier has been found'
      });
    }
    req.commuteest = commuteest;
    next();
  });
};

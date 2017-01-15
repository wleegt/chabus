'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Movingline = mongoose.model('Movingline'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Movingline
 */
exports.create = function(req, res) {
  var movingline = new Movingline(req.body);
  movingline.user = req.user;

  movingline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movingline);
    }
  });
};

/**
 * Show the current Movingline
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var movingline = req.movingline ? req.movingline.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  movingline.isCurrentUserOwner = req.user && movingline.user && movingline.user._id.toString() === req.user._id.toString();

  res.jsonp(movingline);
};

/**
 * Update a Movingline
 */
exports.update = function(req, res) {
  var movingline = req.movingline;

  movingline = _.extend(movingline, req.body);

  movingline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movingline);
    }
  });
};

/**
 * Delete an Movingline
 */
exports.delete = function(req, res) {
  var movingline = req.movingline;

  movingline.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movingline);
    }
  });
};

/**
 * List of Movinglines
 */
exports.list = function(req, res) {
  Movingline.find().sort('-created').populate('user', 'displayName').exec(function(err, movinglines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movinglines);
    }
  });
};

/**
 * Movingline middleware
 */
exports.movinglineByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Movingline is invalid'
    });
  }

  Movingline.findById(id).populate('user', 'displayName').exec(function (err, movingline) {
    if (err) {
      return next(err);
    } else if (!movingline) {
      return res.status(404).send({
        message: 'No Movingline with that identifier has been found'
      });
    }
    req.movingline = movingline;
    next();
  });
};

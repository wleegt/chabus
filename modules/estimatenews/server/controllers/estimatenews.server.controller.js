'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Estimatenew = mongoose.model('Estimatenew'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Estimatenew
 */
exports.create = function(req, res) {
  var estimatenew = new Estimatenew(req.body);
  estimatenew.user = req.user;

  estimatenew.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estimatenew);
    }
  });
};

/**
 * Show the current Estimatenew
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var estimatenew = req.estimatenew ? req.estimatenew.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  estimatenew.isCurrentUserOwner = (req.user && estimatenew.user && estimatenew.user._id.toString() === req.user._id.toString()) || _.includes(req.user.roles,'admin');

  res.jsonp(estimatenew);
};

/**
 * Update a Estimatenew
 */
exports.update = function(req, res) {
  var estimatenew = req.estimatenew;

  estimatenew = _.extend(estimatenew, req.body);

  estimatenew.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estimatenew);
    }
  });
};

/**
 * Delete an Estimatenew
 */
exports.delete = function(req, res) {
  var estimatenew = req.estimatenew;

  estimatenew.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estimatenew);
    }
  });
};

/**
 * List of Estimatenews
 */
exports.list = function(req, res) {
  Estimatenew.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, estimatenews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(estimatenews);
    }
  });
};

/**
 * Estimatenew middleware
 */
exports.estimatenewByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Estimatenew is invalid'
    });
  }

  Estimatenew.findById(id).populate('user', 'displayName').exec(function (err, estimatenew) {
    if (err) {
      return next(err);
    } else if (!estimatenew) {
      return res.status(404).send({
        message: 'No Estimatenew with that identifier has been found'
      });
    }
    req.estimatenew = estimatenew;
    next();
  });
};

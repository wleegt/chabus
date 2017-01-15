'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Estimate = mongoose.model('Estimate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a estimate
 */
exports.create = function (req, res) {
  var estimate = new Estimate(req.body);
  estimate.user = req.user;

  estimate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(estimate);
    }
  });
};

/**
 * Show the current estimate
 */
exports.read = function (req, res) {
  res.json(req.estimate);
};

/**
 * Update a estimate
 */
exports.update = function (req, res) {
  var estimate = req.estimate;

  estimate.startposition = req.body.startposition;
  estimate.endposition = req.body.endposition;
  estimate.isturnback = req.body.isturnback;
  estimate.message = req.body.message;

  estimate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(estimate);
    }
  });
};

/**
 * Delete an estimate
 */
exports.delete = function (req, res) {
  var estimate = req.estimate;

  estimate.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(estimate);
    }
  });
};

/**
 * List of Estimates
 */
exports.list = function (req, res) {
  Estimate.find().sort('-created').populate('user', 'displayName').exec(function (err, estimates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(estimates);
    }
  });
};

/**
 * Estimate middleware
 */
exports.estimateByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Estimate is invalid'
    });
  }

  Estimate.findById(id).populate('user', 'displayName').exec(function (err, estimate) {
    if (err) {
      return next(err);
    } else if (!estimate) {
      return res.status(404).send({
        message: 'No estimate with that identifier has been found'
      });
    }
    req.estimate = estimate;
    next();
  });
};

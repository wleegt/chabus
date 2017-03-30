'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });

  /// delete all image files when removing user
  var imageUrlsToDelete = [];
  if (user.profileImageURL !== User.schema.path('profileImageURL').defaultValue) {
    imageUrlsToDelete.push(user.profileImageURL);
  }
  for (var i = 0; i < user.busImageURLs.length; i++) {
    if (user.busImageURLs[i] !== './modules/users/client/img/custom/defaultBus.png') {
      imageUrlsToDelete.push(user.busImageURLs[i]);
    }
  }
  if (user.licenseImageURL !== User.schema.path('licenseImageURL').defaultValue) {
    imageUrlsToDelete.push(user.licenseImageURL);
  }
  if (user.registrationImageURL !== User.schema.path('registrationImageURL').defaultValue) {
    imageUrlsToDelete.push(user.registrationImageURL);
  }
  // console.log(imageUrlsToDelete);

  if (imageUrlsToDelete.length > 0) {
    function deleteFiles(files, callback){
      var i = files.length;
      files.forEach(function(filepath){
        fs.unlink(filepath, function(err) {
          i--;
          if (err) {
            callback(err);
            return;
          } else if (i <= 0) {
            callback(null);
          }
        });
      });
    }
    deleteFiles(imageUrlsToDelete, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('all files removed');
      }
    });
  }
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

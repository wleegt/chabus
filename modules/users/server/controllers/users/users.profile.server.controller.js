'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + '' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


/**
 * Update Bus picture
 */
exports.changeBusPicture = function (req, res) {
  var user = req.user;

  /// Filtering to upload only images
  var multerConfig = _.includes(user.roles, 'person') ? config.uploads.personUpload : (_.includes(user.roles, 'driver') ? config.uploads.driverUpload : config.uploads.comdriverUpload);
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  var upload = multer(multerConfig).array('newBusPicture', 8);


  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        // console.log(uploadError);
        return res.status(400).send({
          message: 'Error occurred while uploading pictures'
        });
      } else {
        // console.log(req.files);
        // console.log(req.file);
        // console.log(req.body);
        for (var i = 0; i < req.files.length; i++) {
          var n = parseInt(req.body.picIndex[i]);
          if (n === 0) {
            user.profileImageURL = multerConfig.dest + req.files[i].filename;
          } else if (n > 0 && n < 6) {
            // user.busImageURLs[n] = config.uploads.busUpload.dest + req.files[i].filename;
            user.busImageURLs.splice(n - 1, 1, multerConfig.dest + req.files[i].filename);
          } else if (n === 6) {
            user.licenseImageURL = multerConfig.dest + req.files[i].filename;
          } else if (n === 7) {
            user.registrationImageURL = multerConfig.dest + req.files[i].filename;
          }
        }

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

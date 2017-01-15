'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Estimates Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/estimates',
      permissions: '*'
    }, {
      resources: '/api/estimates/:estimateId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/estimates',
      permissions: ['get']
    }, {
      resources: '/api/estimates/:estimateId',
      permissions: ['get']
    }]
  }, {
    roles: ['driver'],
    allows: [{
      resources: '/api/estimates',
      permissions: ['get','post']
    }, {
      resources: '/api/estimates/:estimateId',
      permissions: ['get','post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/estimates',
      permissions: ['get']
    }, {
      resources: '/api/estimates/:estimateId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Estimates Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an estimate is being processed and the current user created it then allow any manipulation
  if (req.estimate && req.user && req.estimate.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

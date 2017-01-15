'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Estimatenews Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/estimatenews',
      permissions: '*'
    }, {
      resources: '/api/estimatenews/:estimatenewId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/estimatenews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/estimatenews/:estimatenewId',
      permissions: ['get']
    }]
  }, {
    roles: ['driver'],
    allows: [{
      resources: '/api/estimatenews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/estimatenews/:estimatenewId',
      permissions: ['get']
    }]
  }, {
    roles: ['comdriver'],
    allows: [{
      resources: '/api/estimatenews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/estimatenews/:estimatenewId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/estimatenews',
      permissions: ['get']
    }, {
      resources: '/api/estimatenews/:estimatenewId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Estimatenews Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Estimatenew is being processed and the current user created it then allow any manipulation
  if (req.estimatenew && req.user && req.estimatenew.user && req.estimatenew.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
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

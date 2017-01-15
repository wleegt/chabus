'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Estimate = mongoose.model('Estimate'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, estimate;

/**
 * Estimate routes tests
 */
describe('Estimate CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new estimate
    user.save(function () {
      estimate = {
        title: 'Estimate Title',
        content: 'Estimate Content'
      };

      done();
    });
  });

  it('should be able to save an estimate if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new estimate
        agent.post('/api/estimates')
          .send(estimate)
          .expect(200)
          .end(function (estimateSaveErr, estimateSaveRes) {
            // Handle estimate save error
            if (estimateSaveErr) {
              return done(estimateSaveErr);
            }

            // Get a list of estimates
            agent.get('/api/estimates')
              .end(function (estimatesGetErr, estimatesGetRes) {
                // Handle estimate save error
                if (estimatesGetErr) {
                  return done(estimatesGetErr);
                }

                // Get estimates list
                var estimates = estimatesGetRes.body;

                // Set assertions
                (estimates[0].user._id).should.equal(userId);
                (estimates[0].title).should.match('Estimate Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an estimate if not logged in', function (done) {
    agent.post('/api/estimates')
      .send(estimate)
      .expect(403)
      .end(function (estimateSaveErr, estimateSaveRes) {
        // Call the assertion callback
        done(estimateSaveErr);
      });
  });

  it('should not be able to save an estimate if no title is provided', function (done) {
    // Invalidate title field
    estimate.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new estimate
        agent.post('/api/estimates')
          .send(estimate)
          .expect(400)
          .end(function (estimateSaveErr, estimateSaveRes) {
            // Set message assertion
            (estimateSaveRes.body.message).should.match('Title cannot be blank');

            // Handle estimate save error
            done(estimateSaveErr);
          });
      });
  });

  it('should be able to update an estimate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new estimate
        agent.post('/api/estimates')
          .send(estimate)
          .expect(200)
          .end(function (estimateSaveErr, estimateSaveRes) {
            // Handle estimate save error
            if (estimateSaveErr) {
              return done(estimateSaveErr);
            }

            // Update estimate title
            estimate.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing estimate
            agent.put('/api/estimates/' + estimateSaveRes.body._id)
              .send(estimate)
              .expect(200)
              .end(function (estimateUpdateErr, estimateUpdateRes) {
                // Handle estimate update error
                if (estimateUpdateErr) {
                  return done(estimateUpdateErr);
                }

                // Set assertions
                (estimateUpdateRes.body._id).should.equal(estimateSaveRes.body._id);
                (estimateUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of estimates if not signed in', function (done) {
    // Create new estimate model instance
    var estimateObj = new Estimate(estimate);

    // Save the estimate
    estimateObj.save(function () {
      // Request estimates
      request(app).get('/api/estimates')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single estimate if not signed in', function (done) {
    // Create new estimate model instance
    var estimateObj = new Estimate(estimate);

    // Save the estimate
    estimateObj.save(function () {
      request(app).get('/api/estimates/' + estimateObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', estimate.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single estimate with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/estimates/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Estimate is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single estimate which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent estimate
    request(app).get('/api/estimates/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No estimate with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an estimate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new estimate
        agent.post('/api/estimates')
          .send(estimate)
          .expect(200)
          .end(function (estimateSaveErr, estimateSaveRes) {
            // Handle estimate save error
            if (estimateSaveErr) {
              return done(estimateSaveErr);
            }

            // Delete an existing estimate
            agent.delete('/api/estimates/' + estimateSaveRes.body._id)
              .send(estimate)
              .expect(200)
              .end(function (estimateDeleteErr, estimateDeleteRes) {
                // Handle estimate error error
                if (estimateDeleteErr) {
                  return done(estimateDeleteErr);
                }

                // Set assertions
                (estimateDeleteRes.body._id).should.equal(estimateSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an estimate if not signed in', function (done) {
    // Set estimate user
    estimate.user = user;

    // Create new estimate model instance
    var estimateObj = new Estimate(estimate);

    // Save the estimate
    estimateObj.save(function () {
      // Try deleting estimate
      request(app).delete('/api/estimates/' + estimateObj._id)
        .expect(403)
        .end(function (estimateDeleteErr, estimateDeleteRes) {
          // Set message assertion
          (estimateDeleteRes.body.message).should.match('User is not authorized');

          // Handle estimate error error
          done(estimateDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Estimate.remove().exec(done);
    });
  });
});

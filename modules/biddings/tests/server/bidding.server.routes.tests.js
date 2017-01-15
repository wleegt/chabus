'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bidding = mongoose.model('Bidding'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  bidding;

/**
 * Bidding routes tests
 */
describe('Bidding CRUD tests', function () {

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

    // Save a user to the test db and create new Bidding
    user.save(function () {
      bidding = {
        name: 'Bidding name'
      };

      done();
    });
  });

  it('should be able to save a Bidding if logged in', function (done) {
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

        // Save a new Bidding
        agent.post('/api/biddings')
          .send(bidding)
          .expect(200)
          .end(function (biddingSaveErr, biddingSaveRes) {
            // Handle Bidding save error
            if (biddingSaveErr) {
              return done(biddingSaveErr);
            }

            // Get a list of Biddings
            agent.get('/api/biddings')
              .end(function (biddingsGetErr, biddingsGetRes) {
                // Handle Biddings save error
                if (biddingsGetErr) {
                  return done(biddingsGetErr);
                }

                // Get Biddings list
                var biddings = biddingsGetRes.body;

                // Set assertions
                (biddings[0].user._id).should.equal(userId);
                (biddings[0].name).should.match('Bidding name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bidding if not logged in', function (done) {
    agent.post('/api/biddings')
      .send(bidding)
      .expect(403)
      .end(function (biddingSaveErr, biddingSaveRes) {
        // Call the assertion callback
        done(biddingSaveErr);
      });
  });

  it('should not be able to save an Bidding if no name is provided', function (done) {
    // Invalidate name field
    bidding.name = '';

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

        // Save a new Bidding
        agent.post('/api/biddings')
          .send(bidding)
          .expect(400)
          .end(function (biddingSaveErr, biddingSaveRes) {
            // Set message assertion
            (biddingSaveRes.body.message).should.match('Please fill Bidding name');

            // Handle Bidding save error
            done(biddingSaveErr);
          });
      });
  });

  it('should be able to update an Bidding if signed in', function (done) {
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

        // Save a new Bidding
        agent.post('/api/biddings')
          .send(bidding)
          .expect(200)
          .end(function (biddingSaveErr, biddingSaveRes) {
            // Handle Bidding save error
            if (biddingSaveErr) {
              return done(biddingSaveErr);
            }

            // Update Bidding name
            bidding.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bidding
            agent.put('/api/biddings/' + biddingSaveRes.body._id)
              .send(bidding)
              .expect(200)
              .end(function (biddingUpdateErr, biddingUpdateRes) {
                // Handle Bidding update error
                if (biddingUpdateErr) {
                  return done(biddingUpdateErr);
                }

                // Set assertions
                (biddingUpdateRes.body._id).should.equal(biddingSaveRes.body._id);
                (biddingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Biddings if not signed in', function (done) {
    // Create new Bidding model instance
    var biddingObj = new Bidding(bidding);

    // Save the bidding
    biddingObj.save(function () {
      // Request Biddings
      request(app).get('/api/biddings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bidding if not signed in', function (done) {
    // Create new Bidding model instance
    var biddingObj = new Bidding(bidding);

    // Save the Bidding
    biddingObj.save(function () {
      request(app).get('/api/biddings/' + biddingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bidding.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bidding with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/biddings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bidding is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bidding which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bidding
    request(app).get('/api/biddings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bidding with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bidding if signed in', function (done) {
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

        // Save a new Bidding
        agent.post('/api/biddings')
          .send(bidding)
          .expect(200)
          .end(function (biddingSaveErr, biddingSaveRes) {
            // Handle Bidding save error
            if (biddingSaveErr) {
              return done(biddingSaveErr);
            }

            // Delete an existing Bidding
            agent.delete('/api/biddings/' + biddingSaveRes.body._id)
              .send(bidding)
              .expect(200)
              .end(function (biddingDeleteErr, biddingDeleteRes) {
                // Handle bidding error error
                if (biddingDeleteErr) {
                  return done(biddingDeleteErr);
                }

                // Set assertions
                (biddingDeleteRes.body._id).should.equal(biddingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bidding if not signed in', function (done) {
    // Set Bidding user
    bidding.user = user;

    // Create new Bidding model instance
    var biddingObj = new Bidding(bidding);

    // Save the Bidding
    biddingObj.save(function () {
      // Try deleting Bidding
      request(app).delete('/api/biddings/' + biddingObj._id)
        .expect(403)
        .end(function (biddingDeleteErr, biddingDeleteRes) {
          // Set message assertion
          (biddingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bidding error error
          done(biddingDeleteErr);
        });

    });
  });

  it('should be able to get a single Bidding that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Bidding
          agent.post('/api/biddings')
            .send(bidding)
            .expect(200)
            .end(function (biddingSaveErr, biddingSaveRes) {
              // Handle Bidding save error
              if (biddingSaveErr) {
                return done(biddingSaveErr);
              }

              // Set assertions on new Bidding
              (biddingSaveRes.body.name).should.equal(bidding.name);
              should.exist(biddingSaveRes.body.user);
              should.equal(biddingSaveRes.body.user._id, orphanId);

              // force the Bidding to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Bidding
                    agent.get('/api/biddings/' + biddingSaveRes.body._id)
                      .expect(200)
                      .end(function (biddingInfoErr, biddingInfoRes) {
                        // Handle Bidding error
                        if (biddingInfoErr) {
                          return done(biddingInfoErr);
                        }

                        // Set assertions
                        (biddingInfoRes.body._id).should.equal(biddingSaveRes.body._id);
                        (biddingInfoRes.body.name).should.equal(bidding.name);
                        should.equal(biddingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Bidding.remove().exec(done);
    });
  });
});

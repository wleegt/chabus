'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Estimatenew = mongoose.model('Estimatenew'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  estimatenew;

/**
 * Estimatenew routes tests
 */
describe('Estimatenew CRUD tests', function () {

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

    // Save a user to the test db and create new Estimatenew
    user.save(function () {
      estimatenew = {
        name: 'Estimatenew name'
      };

      done();
    });
  });

  it('should be able to save a Estimatenew if logged in', function (done) {
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

        // Save a new Estimatenew
        agent.post('/api/estimatenews')
          .send(estimatenew)
          .expect(200)
          .end(function (estimatenewSaveErr, estimatenewSaveRes) {
            // Handle Estimatenew save error
            if (estimatenewSaveErr) {
              return done(estimatenewSaveErr);
            }

            // Get a list of Estimatenews
            agent.get('/api/estimatenews')
              .end(function (estimatenewsGetErr, estimatenewsGetRes) {
                // Handle Estimatenews save error
                if (estimatenewsGetErr) {
                  return done(estimatenewsGetErr);
                }

                // Get Estimatenews list
                var estimatenews = estimatenewsGetRes.body;

                // Set assertions
                (estimatenews[0].user._id).should.equal(userId);
                (estimatenews[0].name).should.match('Estimatenew name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Estimatenew if not logged in', function (done) {
    agent.post('/api/estimatenews')
      .send(estimatenew)
      .expect(403)
      .end(function (estimatenewSaveErr, estimatenewSaveRes) {
        // Call the assertion callback
        done(estimatenewSaveErr);
      });
  });

  it('should not be able to save an Estimatenew if no name is provided', function (done) {
    // Invalidate name field
    estimatenew.name = '';

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

        // Save a new Estimatenew
        agent.post('/api/estimatenews')
          .send(estimatenew)
          .expect(400)
          .end(function (estimatenewSaveErr, estimatenewSaveRes) {
            // Set message assertion
            (estimatenewSaveRes.body.message).should.match('Please fill Estimatenew name');

            // Handle Estimatenew save error
            done(estimatenewSaveErr);
          });
      });
  });

  it('should be able to update an Estimatenew if signed in', function (done) {
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

        // Save a new Estimatenew
        agent.post('/api/estimatenews')
          .send(estimatenew)
          .expect(200)
          .end(function (estimatenewSaveErr, estimatenewSaveRes) {
            // Handle Estimatenew save error
            if (estimatenewSaveErr) {
              return done(estimatenewSaveErr);
            }

            // Update Estimatenew name
            estimatenew.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Estimatenew
            agent.put('/api/estimatenews/' + estimatenewSaveRes.body._id)
              .send(estimatenew)
              .expect(200)
              .end(function (estimatenewUpdateErr, estimatenewUpdateRes) {
                // Handle Estimatenew update error
                if (estimatenewUpdateErr) {
                  return done(estimatenewUpdateErr);
                }

                // Set assertions
                (estimatenewUpdateRes.body._id).should.equal(estimatenewSaveRes.body._id);
                (estimatenewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Estimatenews if not signed in', function (done) {
    // Create new Estimatenew model instance
    var estimatenewObj = new Estimatenew(estimatenew);

    // Save the estimatenew
    estimatenewObj.save(function () {
      // Request Estimatenews
      request(app).get('/api/estimatenews')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Estimatenew if not signed in', function (done) {
    // Create new Estimatenew model instance
    var estimatenewObj = new Estimatenew(estimatenew);

    // Save the Estimatenew
    estimatenewObj.save(function () {
      request(app).get('/api/estimatenews/' + estimatenewObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', estimatenew.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Estimatenew with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/estimatenews/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Estimatenew is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Estimatenew which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Estimatenew
    request(app).get('/api/estimatenews/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Estimatenew with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Estimatenew if signed in', function (done) {
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

        // Save a new Estimatenew
        agent.post('/api/estimatenews')
          .send(estimatenew)
          .expect(200)
          .end(function (estimatenewSaveErr, estimatenewSaveRes) {
            // Handle Estimatenew save error
            if (estimatenewSaveErr) {
              return done(estimatenewSaveErr);
            }

            // Delete an existing Estimatenew
            agent.delete('/api/estimatenews/' + estimatenewSaveRes.body._id)
              .send(estimatenew)
              .expect(200)
              .end(function (estimatenewDeleteErr, estimatenewDeleteRes) {
                // Handle estimatenew error error
                if (estimatenewDeleteErr) {
                  return done(estimatenewDeleteErr);
                }

                // Set assertions
                (estimatenewDeleteRes.body._id).should.equal(estimatenewSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Estimatenew if not signed in', function (done) {
    // Set Estimatenew user
    estimatenew.user = user;

    // Create new Estimatenew model instance
    var estimatenewObj = new Estimatenew(estimatenew);

    // Save the Estimatenew
    estimatenewObj.save(function () {
      // Try deleting Estimatenew
      request(app).delete('/api/estimatenews/' + estimatenewObj._id)
        .expect(403)
        .end(function (estimatenewDeleteErr, estimatenewDeleteRes) {
          // Set message assertion
          (estimatenewDeleteRes.body.message).should.match('User is not authorized');

          // Handle Estimatenew error error
          done(estimatenewDeleteErr);
        });

    });
  });

  it('should be able to get a single Estimatenew that has an orphaned user reference', function (done) {
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

          // Save a new Estimatenew
          agent.post('/api/estimatenews')
            .send(estimatenew)
            .expect(200)
            .end(function (estimatenewSaveErr, estimatenewSaveRes) {
              // Handle Estimatenew save error
              if (estimatenewSaveErr) {
                return done(estimatenewSaveErr);
              }

              // Set assertions on new Estimatenew
              (estimatenewSaveRes.body.name).should.equal(estimatenew.name);
              should.exist(estimatenewSaveRes.body.user);
              should.equal(estimatenewSaveRes.body.user._id, orphanId);

              // force the Estimatenew to have an orphaned user reference
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

                    // Get the Estimatenew
                    agent.get('/api/estimatenews/' + estimatenewSaveRes.body._id)
                      .expect(200)
                      .end(function (estimatenewInfoErr, estimatenewInfoRes) {
                        // Handle Estimatenew error
                        if (estimatenewInfoErr) {
                          return done(estimatenewInfoErr);
                        }

                        // Set assertions
                        (estimatenewInfoRes.body._id).should.equal(estimatenewSaveRes.body._id);
                        (estimatenewInfoRes.body.name).should.equal(estimatenew.name);
                        should.equal(estimatenewInfoRes.body.user, undefined);

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
      Estimatenew.remove().exec(done);
    });
  });
});

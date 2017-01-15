'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Commuteest = mongoose.model('Commuteest'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  commuteest;

/**
 * Commuteest routes tests
 */
describe('Commuteest CRUD tests', function () {

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

    // Save a user to the test db and create new Commuteest
    user.save(function () {
      commuteest = {
        name: 'Commuteest name'
      };

      done();
    });
  });

  it('should be able to save a Commuteest if logged in', function (done) {
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

        // Save a new Commuteest
        agent.post('/api/commuteests')
          .send(commuteest)
          .expect(200)
          .end(function (commuteestSaveErr, commuteestSaveRes) {
            // Handle Commuteest save error
            if (commuteestSaveErr) {
              return done(commuteestSaveErr);
            }

            // Get a list of Commuteests
            agent.get('/api/commuteests')
              .end(function (commuteestsGetErr, commuteestsGetRes) {
                // Handle Commuteests save error
                if (commuteestsGetErr) {
                  return done(commuteestsGetErr);
                }

                // Get Commuteests list
                var commuteests = commuteestsGetRes.body;

                // Set assertions
                (commuteests[0].user._id).should.equal(userId);
                (commuteests[0].name).should.match('Commuteest name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Commuteest if not logged in', function (done) {
    agent.post('/api/commuteests')
      .send(commuteest)
      .expect(403)
      .end(function (commuteestSaveErr, commuteestSaveRes) {
        // Call the assertion callback
        done(commuteestSaveErr);
      });
  });

  it('should not be able to save an Commuteest if no name is provided', function (done) {
    // Invalidate name field
    commuteest.name = '';

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

        // Save a new Commuteest
        agent.post('/api/commuteests')
          .send(commuteest)
          .expect(400)
          .end(function (commuteestSaveErr, commuteestSaveRes) {
            // Set message assertion
            (commuteestSaveRes.body.message).should.match('Please fill Commuteest name');

            // Handle Commuteest save error
            done(commuteestSaveErr);
          });
      });
  });

  it('should be able to update an Commuteest if signed in', function (done) {
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

        // Save a new Commuteest
        agent.post('/api/commuteests')
          .send(commuteest)
          .expect(200)
          .end(function (commuteestSaveErr, commuteestSaveRes) {
            // Handle Commuteest save error
            if (commuteestSaveErr) {
              return done(commuteestSaveErr);
            }

            // Update Commuteest name
            commuteest.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Commuteest
            agent.put('/api/commuteests/' + commuteestSaveRes.body._id)
              .send(commuteest)
              .expect(200)
              .end(function (commuteestUpdateErr, commuteestUpdateRes) {
                // Handle Commuteest update error
                if (commuteestUpdateErr) {
                  return done(commuteestUpdateErr);
                }

                // Set assertions
                (commuteestUpdateRes.body._id).should.equal(commuteestSaveRes.body._id);
                (commuteestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Commuteests if not signed in', function (done) {
    // Create new Commuteest model instance
    var commuteestObj = new Commuteest(commuteest);

    // Save the commuteest
    commuteestObj.save(function () {
      // Request Commuteests
      request(app).get('/api/commuteests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Commuteest if not signed in', function (done) {
    // Create new Commuteest model instance
    var commuteestObj = new Commuteest(commuteest);

    // Save the Commuteest
    commuteestObj.save(function () {
      request(app).get('/api/commuteests/' + commuteestObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', commuteest.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Commuteest with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/commuteests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Commuteest is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Commuteest which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Commuteest
    request(app).get('/api/commuteests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Commuteest with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Commuteest if signed in', function (done) {
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

        // Save a new Commuteest
        agent.post('/api/commuteests')
          .send(commuteest)
          .expect(200)
          .end(function (commuteestSaveErr, commuteestSaveRes) {
            // Handle Commuteest save error
            if (commuteestSaveErr) {
              return done(commuteestSaveErr);
            }

            // Delete an existing Commuteest
            agent.delete('/api/commuteests/' + commuteestSaveRes.body._id)
              .send(commuteest)
              .expect(200)
              .end(function (commuteestDeleteErr, commuteestDeleteRes) {
                // Handle commuteest error error
                if (commuteestDeleteErr) {
                  return done(commuteestDeleteErr);
                }

                // Set assertions
                (commuteestDeleteRes.body._id).should.equal(commuteestSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Commuteest if not signed in', function (done) {
    // Set Commuteest user
    commuteest.user = user;

    // Create new Commuteest model instance
    var commuteestObj = new Commuteest(commuteest);

    // Save the Commuteest
    commuteestObj.save(function () {
      // Try deleting Commuteest
      request(app).delete('/api/commuteests/' + commuteestObj._id)
        .expect(403)
        .end(function (commuteestDeleteErr, commuteestDeleteRes) {
          // Set message assertion
          (commuteestDeleteRes.body.message).should.match('User is not authorized');

          // Handle Commuteest error error
          done(commuteestDeleteErr);
        });

    });
  });

  it('should be able to get a single Commuteest that has an orphaned user reference', function (done) {
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

          // Save a new Commuteest
          agent.post('/api/commuteests')
            .send(commuteest)
            .expect(200)
            .end(function (commuteestSaveErr, commuteestSaveRes) {
              // Handle Commuteest save error
              if (commuteestSaveErr) {
                return done(commuteestSaveErr);
              }

              // Set assertions on new Commuteest
              (commuteestSaveRes.body.name).should.equal(commuteest.name);
              should.exist(commuteestSaveRes.body.user);
              should.equal(commuteestSaveRes.body.user._id, orphanId);

              // force the Commuteest to have an orphaned user reference
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

                    // Get the Commuteest
                    agent.get('/api/commuteests/' + commuteestSaveRes.body._id)
                      .expect(200)
                      .end(function (commuteestInfoErr, commuteestInfoRes) {
                        // Handle Commuteest error
                        if (commuteestInfoErr) {
                          return done(commuteestInfoErr);
                        }

                        // Set assertions
                        (commuteestInfoRes.body._id).should.equal(commuteestSaveRes.body._id);
                        (commuteestInfoRes.body.name).should.equal(commuteest.name);
                        should.equal(commuteestInfoRes.body.user, undefined);

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
      Commuteest.remove().exec(done);
    });
  });
});

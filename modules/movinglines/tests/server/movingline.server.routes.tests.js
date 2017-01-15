'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Movingline = mongoose.model('Movingline'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  movingline;

/**
 * Movingline routes tests
 */
describe('Movingline CRUD tests', function () {

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

    // Save a user to the test db and create new Movingline
    user.save(function () {
      movingline = {
        name: 'Movingline name'
      };

      done();
    });
  });

  it('should be able to save a Movingline if logged in', function (done) {
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

        // Save a new Movingline
        agent.post('/api/movinglines')
          .send(movingline)
          .expect(200)
          .end(function (movinglineSaveErr, movinglineSaveRes) {
            // Handle Movingline save error
            if (movinglineSaveErr) {
              return done(movinglineSaveErr);
            }

            // Get a list of Movinglines
            agent.get('/api/movinglines')
              .end(function (movinglinesGetErr, movinglinesGetRes) {
                // Handle Movinglines save error
                if (movinglinesGetErr) {
                  return done(movinglinesGetErr);
                }

                // Get Movinglines list
                var movinglines = movinglinesGetRes.body;

                // Set assertions
                (movinglines[0].user._id).should.equal(userId);
                (movinglines[0].name).should.match('Movingline name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Movingline if not logged in', function (done) {
    agent.post('/api/movinglines')
      .send(movingline)
      .expect(403)
      .end(function (movinglineSaveErr, movinglineSaveRes) {
        // Call the assertion callback
        done(movinglineSaveErr);
      });
  });

  it('should not be able to save an Movingline if no name is provided', function (done) {
    // Invalidate name field
    movingline.name = '';

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

        // Save a new Movingline
        agent.post('/api/movinglines')
          .send(movingline)
          .expect(400)
          .end(function (movinglineSaveErr, movinglineSaveRes) {
            // Set message assertion
            (movinglineSaveRes.body.message).should.match('Please fill Movingline name');

            // Handle Movingline save error
            done(movinglineSaveErr);
          });
      });
  });

  it('should be able to update an Movingline if signed in', function (done) {
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

        // Save a new Movingline
        agent.post('/api/movinglines')
          .send(movingline)
          .expect(200)
          .end(function (movinglineSaveErr, movinglineSaveRes) {
            // Handle Movingline save error
            if (movinglineSaveErr) {
              return done(movinglineSaveErr);
            }

            // Update Movingline name
            movingline.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Movingline
            agent.put('/api/movinglines/' + movinglineSaveRes.body._id)
              .send(movingline)
              .expect(200)
              .end(function (movinglineUpdateErr, movinglineUpdateRes) {
                // Handle Movingline update error
                if (movinglineUpdateErr) {
                  return done(movinglineUpdateErr);
                }

                // Set assertions
                (movinglineUpdateRes.body._id).should.equal(movinglineSaveRes.body._id);
                (movinglineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Movinglines if not signed in', function (done) {
    // Create new Movingline model instance
    var movinglineObj = new Movingline(movingline);

    // Save the movingline
    movinglineObj.save(function () {
      // Request Movinglines
      request(app).get('/api/movinglines')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Movingline if not signed in', function (done) {
    // Create new Movingline model instance
    var movinglineObj = new Movingline(movingline);

    // Save the Movingline
    movinglineObj.save(function () {
      request(app).get('/api/movinglines/' + movinglineObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', movingline.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Movingline with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/movinglines/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Movingline is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Movingline which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Movingline
    request(app).get('/api/movinglines/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Movingline with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Movingline if signed in', function (done) {
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

        // Save a new Movingline
        agent.post('/api/movinglines')
          .send(movingline)
          .expect(200)
          .end(function (movinglineSaveErr, movinglineSaveRes) {
            // Handle Movingline save error
            if (movinglineSaveErr) {
              return done(movinglineSaveErr);
            }

            // Delete an existing Movingline
            agent.delete('/api/movinglines/' + movinglineSaveRes.body._id)
              .send(movingline)
              .expect(200)
              .end(function (movinglineDeleteErr, movinglineDeleteRes) {
                // Handle movingline error error
                if (movinglineDeleteErr) {
                  return done(movinglineDeleteErr);
                }

                // Set assertions
                (movinglineDeleteRes.body._id).should.equal(movinglineSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Movingline if not signed in', function (done) {
    // Set Movingline user
    movingline.user = user;

    // Create new Movingline model instance
    var movinglineObj = new Movingline(movingline);

    // Save the Movingline
    movinglineObj.save(function () {
      // Try deleting Movingline
      request(app).delete('/api/movinglines/' + movinglineObj._id)
        .expect(403)
        .end(function (movinglineDeleteErr, movinglineDeleteRes) {
          // Set message assertion
          (movinglineDeleteRes.body.message).should.match('User is not authorized');

          // Handle Movingline error error
          done(movinglineDeleteErr);
        });

    });
  });

  it('should be able to get a single Movingline that has an orphaned user reference', function (done) {
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

          // Save a new Movingline
          agent.post('/api/movinglines')
            .send(movingline)
            .expect(200)
            .end(function (movinglineSaveErr, movinglineSaveRes) {
              // Handle Movingline save error
              if (movinglineSaveErr) {
                return done(movinglineSaveErr);
              }

              // Set assertions on new Movingline
              (movinglineSaveRes.body.name).should.equal(movingline.name);
              should.exist(movinglineSaveRes.body.user);
              should.equal(movinglineSaveRes.body.user._id, orphanId);

              // force the Movingline to have an orphaned user reference
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

                    // Get the Movingline
                    agent.get('/api/movinglines/' + movinglineSaveRes.body._id)
                      .expect(200)
                      .end(function (movinglineInfoErr, movinglineInfoRes) {
                        // Handle Movingline error
                        if (movinglineInfoErr) {
                          return done(movinglineInfoErr);
                        }

                        // Set assertions
                        (movinglineInfoRes.body._id).should.equal(movinglineSaveRes.body._id);
                        (movinglineInfoRes.body.name).should.equal(movingline.name);
                        should.equal(movinglineInfoRes.body.user, undefined);

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
      Movingline.remove().exec(done);
    });
  });
});

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Commuteest Schema
 */
var CommuteestSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Commuteest name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Commuteest', CommuteestSchema);

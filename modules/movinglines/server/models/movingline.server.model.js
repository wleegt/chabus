'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Movingline Schema
 */
var MovinglineSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Movingline name',
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

mongoose.model('Movingline', MovinglineSchema);

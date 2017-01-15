'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bidding Schema
 */
var BiddingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Bidding name',
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

mongoose.model('Bidding', BiddingSchema);

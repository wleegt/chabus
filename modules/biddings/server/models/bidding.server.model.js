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
  biddingprice: {
    type: String,
    default: '',
    required: 'Please fill Bidding biddingprice',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  estimatenewId: {
    type: Schema.ObjectId,
    ref: 'Estimatenew'
  }
});

mongoose.model('Bidding', BiddingSchema);

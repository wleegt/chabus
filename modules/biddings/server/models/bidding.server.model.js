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
    type: Number,
    default: null,
    required: 'Please fill Bidding biddingprice'
  },
  toll: {
    type: Boolean,
    default: false
  },
  parkingfee: {
    type: Boolean,
    default: false
  },
  mealprice: {
    type: Boolean,
    default: false
  },
  roomcharge: {
    type: Boolean,
    default: false
  },
  servicecharge: {
    type: Boolean,
    default: false
  },
  vat: {
    type: Boolean,
    default: false
  },
  creditcard: {
    type: Boolean,
    default: false
  },
  taxinvoice: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  isbooked: {
    type: Boolean,
    default: false
  },
  ispayed: {
    type: Boolean,
    default: false
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

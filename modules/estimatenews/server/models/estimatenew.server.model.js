'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Estimatenew Schema
 */
var EstimatenewSchema = new Schema({
  startposition: {
    type: String,
    default: '',
    required: 'Please fill Estimatenew startposition',
    trim: true
  },
  endposition: {
    type: String,
    default: '',
    required: 'Please fill Estimatenew endposition',
    trim: true
  },
  isturnback: {
    type: String,
    default: '왕복',
    trim: true
  },
  startdate: {
    type: Date,
    default: null,
    required: 'Please select Estimatenew startdate'
  },
  starttime: {
    type: String,
    default: '',
    required: 'Please select Estimatenew starttime',
    trim: true
  },
  enddate: {
    type: Date,
    default: null
  },
  endtime: {
    type: String,
    default: '',
    trim: true
  },
  howmany: {
    type: Number,
    default: null,
    required: 'Please fill Estimatenew howmany'
  },
  purpose: {
    type: String,
    default: '',
    required: 'Please select Estimatenew purpose',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Estimatenew phone',
    trim: true
  },

  taxinvoice: {
    type: Boolean,
    default: false
  },
  creditcard: {
    type: Boolean,
    default: false
  },
  quickprice: {
    type: Number,
    default: null
  },
  preferedbus: {
    type: String,
    default: '',
    trim: true
  },
  buscount: {
    type: Number,
    default: null
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  bookingwith: {
    type: String,
    default: '',
    trim: true
  },
  biddingby: {
    type: [String],
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

mongoose.model('Estimatenew', EstimatenewSchema);

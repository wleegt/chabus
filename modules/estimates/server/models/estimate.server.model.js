'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Estimate Schema
 */
var EstimateSchema = new Schema({
  startposition: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  endposition: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  isturnback: {
    type: Boolean,
    default: true
  },
   startdatetime: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  enddatetime: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  // howmany: {
  //   type: Number,
  //   default: null,
  //   required: true
  // },
  // purpose: {
  //   type: String,
  //   default: '',
  //   required: true,
  //   trim: true
  // },
  // phone: {
  //   type: String,
  //   default: '',
  //   required: true,
  //   trim: true
  // },
  //
  // taxinvoice: {
  //   type: Boolean,
  //   default: false
  // },
  // creditcard: {
  //   type: Boolean,
  //   default: false
  // },
  // quickprice: {
  //   type: Number,
  //   default: null
  // },
  // preferedbus: {
  //   type: String,
  //   default: '',
  //   trim: true
  // },
  message: {
    type: String,
    default: '',
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

mongoose.model('Estimate', EstimateSchema);

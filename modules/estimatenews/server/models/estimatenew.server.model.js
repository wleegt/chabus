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
  // name: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Estimatenew name',
  //   trim: true
  // },
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
  // isturnback: {
  //   type: Boolean,
  //   default: true
  // },
  //  startdatetime: {
  //   type: String,
  //   default: '',
  //   required: true,
  //   trim: true
  // },
  // enddatetime: {
  //   type: String,
  //   default: '',
  //   required: true,
  //   trim: true
  // },
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
  kindofest: {
    type: Boolean, // 통근 false, 일반  true
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Estimatenew', EstimatenewSchema);

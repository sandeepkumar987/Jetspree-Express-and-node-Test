'use strict';
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
    "name": { type: String },
    "Price": { type: Number },
    "Brand": { type: String },
    "createdAt": { type: Date, default: Date.now },
    "updatedAt": { type: Date, default: Date.now },
    "isDeleted": { type: Boolean, 'default': false }
});

module.exports = mongoose.model('Item', ItemSchema);
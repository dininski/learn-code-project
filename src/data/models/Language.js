'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
    _id: String,
    version: String,
    executionOptions: Schema.Types.Mixed
});

mongoose.model('Language', LanguageSchema);

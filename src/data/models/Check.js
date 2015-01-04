'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var compactor = require('../compactor');

var CheckSchema = new Schema({
    stdin: String,
    expectedStdOut: String,
    expectedStdErr: String,
    task_id: String
});

//compactor.compact(CheckSchema, ['stdin', 'expectedStdOut', 'expectedStdErr']);

mongoose.model('Check', CheckSchema);

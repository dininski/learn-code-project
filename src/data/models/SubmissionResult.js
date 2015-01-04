'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    compactor = require('../compactor');

var SubmissionResultSchema = new Schema({
    stdout: String,
    stderr: String,
    submission_id: ObjectId
});

SubmissionResultSchema.pre('save', function (next) {
    if (typeof this.submission_id === 'string') {
        this.submission_id = mongoose.Types.ObjectId(this.submission_id);
    }

    next();
});

//compactor.compact(SubmissionResultSchema, ['stdout', 'stderr']);

mongoose.model('SubmissionResult', SubmissionResultSchema);

'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var compactor = require('../compactor');
var validators = require('../validators');
var constants = require('../../common/constants');

var SubmissionSchema = new Schema({
    state: {
        type: Number,
        index: true
    },
    stdin: String,
    user_id: String,
    code: String,
    language_id: String,
    task_id: String
});

var states = _.values(constants.processingStates);

SubmissionSchema
    .path('state')
    .validate(validators.rangeValidator(states), 'Invalid submission state!');

SubmissionSchema.pre('save', function (next) {
    this.state = this.state || 0;
    return next();
});

//compactor.compact(SubmissionSchema, ['code']);
mongoose.model('Submission', SubmissionSchema);

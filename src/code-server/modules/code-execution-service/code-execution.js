'use strict';

var Executor = require('../../../code-worker/executor');
var _ = require('lodash');
var async = require('async');
var constants = require('../../../common/constants');

var defaultOptions = {
    'AttachStdin': true,
    'AttachStdout': true,
    'AttachStderr': true,
    'Tty': false,
    'OpenStdin': true,
    'StdinOnce': true,
    'Volumes': {
        '/executionFolder': {}
    },
    'WorkingDir': '/executionFolder'
};

function getExecutionDir(submissionId) {
    return '/tmp/executions/' + submissionId;
}

var CodeExecutionService = function (dataService, logger) {
    this.dataService = dataService;
    this.logger = logger;
};

CodeExecutionService.prototype = {
    start: function () {
        var self = this;

        setInterval(function () {
            self.processSubmission(function (err) {
                if (err) {
                    self.logger.error(err);
                }
            });
        }, constants.codeExecution.checkInterval);
    },

    processSubmission: function (done) {
        var self = this;
        var fs = require('fs');
        var Submission = self.dataService.get('Submission');

        async.waterfall([
            function (callback) {
                Submission.findOneAndUpdate({
                    state: constants.processingStates.notProcessed
                }, {
                    $set: {
                        state: constants.processingStates.inProgress
                    }
                }, {
                    'new': true
                }, callback);
            },

            function (submission, callback) {
                if (!submission) {
                    return done();
                }

                var Language = self.dataService.get('Language');
                Language.findOne({_id: submission.language_id}, function (err, language) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, submission, language);
                });
            },

            function (submission, language, callback) {
                var executionFolder = getExecutionDir(submission._id);

                fs.mkdir(executionFolder, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, submission, language, executionFolder);
                });
            },

            function (submission, language, executionFolder, callback) {
                fs.writeFile(executionFolder + '/userFile', submission.code, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, submission, language, executionFolder);
                });
            },

            function (submission, language, executionFolder, callback) {
                var executor = new Executor(self.logger);
                var executorOptions = _.defaults(language.executionOptions, defaultOptions);

                executor.init(executorOptions);

                var executionRequest = {
                    executionFolder: executionFolder,
                    submission: submission
                };

                executor.execute(executionRequest, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    self.logger.info(result);
                    callback(null, submission, executionFolder, result);
                });
            },

            function (submission, executionFolder, result, callback) {
                var rimraf = require('rimraf');
                rimraf(executionFolder, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, submission, result);
                });
            },

            function (submission, result, callback) {
                var SubmissionResult = self.dataService.get('SubmissionResult');
                var submissionResult = new SubmissionResult({
                    stderr: result.stderr,
                    stdout: result.stdout
                });

                submissionResult.save(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, submission);
                });
            },

            function (submission, callback) {
                submission.state = constants.processingStates.done;
                submission.save(callback);
            }
        ], done);
    }
};

module.exports = CodeExecutionService;

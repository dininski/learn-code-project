'use strict';

var async = require('async');
var SimpleStream = require('./simple-stream');
var Container = require('./container');
var data = require('../../data/main');

var Executor = function (logger) {
    this._logger = logger;
    this.createOptions = {};
    this.runOptions = {};
    this.container = {};
    this.timeLimit = 0;
    this.stdout = null;
    this.stderr = null;
    this.codeExecutionRequest = null;
};

Executor.prototype = {
    init: function (options) {
        this.createOptions = options;
    },

    beginExecution: function (done) {
        this.container.start(this.runOptions, function (err, container) {
            return done(err);
        });
    },

    execute: function (codeExecutionRequest, done) {
        var self = this;
        this.stdout = new SimpleStream();
        this.stderr = new SimpleStream();

        this.codeExecutionRequest = codeExecutionRequest;
        this.timeLimit = this.codeExecutionRequest.timeLimit;

        var binds = [];
        binds.push(this.codeExecutionRequest.executionFolder + ':/executionFolder');

        this.runOptions = {
            Binds: binds
        };

        this.container = new Container(this.createOptions);

        var submission = codeExecutionRequest.submission;

        async.waterfall([
                function (callback) {
                    self.container.init(callback);
                },

                function (callback) {
                    self.getStream(callback);
                },

                function (stream, callback) {
                    if (submission.stdin) {
                        return callback(null, stream, submission.stdin);
                    } else if (submission.task_id) {
                        var Task = data.get('Task');
                        Task.findOne({_id: submission.task_id}, function (err, task) {
                            if (err) {
                                return callback(err);
                            }

                            return callback(null, stream, task.stdin);
                        });
                    } else {
                        return callback('No stdin or task found!');
                    }
                },

                function (stream, stdin, callback) {
                    self.processStream(stream, stdin, callback);
                },

                self.beginExecution.bind(self),
                self.onExecutionFinished.bind(self)
            ],

            function (err) {
                if (err) {
                    self._logger.error(err);
                    return done(err);
                }

                var result = {
                    stdout: self.stdout.value,
                    stderr: self.stderr.value
                };

                return done(null, result);
            });
    },

    getStream: function (done) {
        this.container.getStream(done);
    },

    processStream: function (stream, stdin, done) {
        var self = this;
        this.container.demuxStream(stream, this.stdout, this.stderr);
        stream.write(stdin, function writeStdinDlg(err) {
            if (err) {
                return done(err);
            }

            self._logger.info('Wrote stdin');
            done();
        });
    },

    onExecutionFinished: function (done) {
        var self = this;

        async.waterfall([
            function (callback) {
                self.container.wait(callback);
            },

            function (data, callback) {
                self.container.inspect(callback);
            },

            function (containerInfo, callback) {
                self.cleanup(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, containerInfo);
                });
            }
        ], function (err, containerInfo) {
            if (err) {
                return done(err);
            }

            self._executionStart = new Date(containerInfo.State.StartedAt);
            self._executionEnd = new Date(containerInfo.State.FinishedAt);
            done();
        });
    },

    cleanup: function (done) {
        this.container.remove(done);
    },

    getExecutionTime: function () {
        return this._executionEnd - this._executionStart;
    }
};

module.exports = Executor;

'use strict';

var data = require('../../../data/main');

var Routing = function () {
    this._httpServer = {};
};

Routing.prototype = {
    init: function (httpServer) {
        this._httpServer = httpServer;
    },

    registerRoutes: function () {
        this._httpServer.registerRoute({
            method: 'post',
            path: '/submissions',
            handler: this.handleSubmissionPostRequest.bind(this)
        });

        this._httpServer.registerRoute({
            method: 'get',
            path: '/submissions/:submissionId',
            handler: this.handleSubmissionGetRequest.bind(this)
        });
    },

    handleSubmissionPostRequest: function (req, res, next) {
        var Submission = data.get('Submission');

        var submission = new Submission({
            stdin: req.body.stdin,
            code: req.body.code,
            language_id: req.body.language_id
        });

        submission.save(function (err) {
            if (err) {
                return next(err);
            }

            res.send(submission._id);
        });
    },

    handleSubmissionGetRequest: function (req, res, next) {
        var Submission = data.get('Submission');
        var submissionId = req.params.submissionId;
        if(submissionId) {
            Submission.findOne({_id: req.params.submissionId}, function (err, submission) {
                if (err) {
                    return next(err);
                }

                res.json(submission);
            });
        } else {
            Submission.find({}, function(err, submissions) {
                if (err) {
                    return next(err);
                }
                
                res.json(submissions);
            })
        }
    }
};

module.exports = Routing;

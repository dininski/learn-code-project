'use strict';

var express = require('express'),
    path = require('path'),
    architect = require('architect');

var configPath = path.join(__dirname, 'modules-config.js');
var config = architect.loadConfig(configPath);

architect.createApp(config, function createArchitectAppDlg(err, app) {
    if (err) {
        console.log(err.stack);
    } else {
        app.services.httpServer.app.use(express.static(__dirname + '/static'));
        app.services.httpServer.start(8080);
    }
});

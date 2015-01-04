'use strict';

module.exports = function setup(options, imports, register) {
    var Routing = require('./routing');
    var routing = new Routing();
    var httpServer = imports.httpServer;

    routing.init(httpServer);
    routing.registerRoutes();

    register(null, {});
};

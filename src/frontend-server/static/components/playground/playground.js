'use strict';

define(function(require) {
    var angular = require('angular');
    var baseModule = angular.module('codeFrontend.playground', []);
    var PlaygroundController = require('components/playground/partials/playground-controller');

    baseModule.config(['$stateProvider', function($stateProvider){
        $stateProvider.state('base.playground', {
            url: '/playground',
            templateUrl: 'components/playground/partials/playground.html',
            controller: 'PlaygroundController'
        });
    }]);

    baseModule.controller('PlaygroundController', PlaygroundController);

    return baseModule;
});

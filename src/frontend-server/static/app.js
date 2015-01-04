'use strict';

define([
        'angular',
        'uiRouter',
        'components/base/base',
        'components/playground/playground',
        'ngAria',
        'ngAnimate',
        'ngMaterial'
    ],
    function (angular) {
        var codeFrontend = angular.module('codeFrontend', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngAria', 'codeFrontend.base', 'codeFrontend.playground']);
        return codeFrontend;
    }
);

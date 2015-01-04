'use strict';

define([],
    function () {
       var injects = ['$scope'];

       var PlaygroundController = function ($scope) {
           $scope.onSubmit = function (submission) {
               console.log(submission);
           };
       };

       PlaygroundController.$injects = injects;

       return PlaygroundController;
    }
);

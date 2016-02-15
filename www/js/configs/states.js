'use strict';

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('dashboard', {
    url: '/dashboard',
    controller: 'DashboardController',
    templateUrl: 'templates/dashboard.html'
  }).state('add-measurement', {
    url: '/new',
    controller: 'AddMeasurementController',
    templateUrl: 'templates/add-measurement.html'
  });

  $urlRouterProvider.otherwise('/dashboard');

});

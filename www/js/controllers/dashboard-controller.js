'use strict';

angular.module('app').controller('DashboardController', function ($scope, Measurements) {
  $scope.measurements = Measurements.all();
});

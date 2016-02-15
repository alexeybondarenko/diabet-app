'use strict';

angular.module('app').controller('AddMeasurementController', function ($scope, $state, Measurement, Measurements) {

  var measurement = new Measurement();
  $scope.model = measurement;

  $scope.save = function (form) {
    if (form.$invalid) return;

    Measurements.add(measurement);
    $state.go('dashboard')
  };
});

'use strict';

angular.module('app').controller('AddMeasurementController', function ($scope, $state, $log, Measurement, Measurements) {

  $log.debug('new controller');
  var measurement = new Measurement();
  $scope.model = measurement;

  $scope.save = function (form) {
    if (form.$invalid) {
      $log.debug('invalid form');
      return;
    }

    Measurements.add(measurement);
    $state.go('dashboard')
  };
});

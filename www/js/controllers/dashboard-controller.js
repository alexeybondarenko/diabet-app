'use strict';

angular.module('app').controller('DashboardController', function ($scope, $ionicPlatform, Measurements) {
  $scope.measurements = Measurements.all();

  function IHealthBG1 () {
    this.reset();
  }
  IHealthBG1.prototype.reset = function () {
    this.connect = false;
    this.ready = false;
    this.stripIn = false;
    this.blood = false;
    this.result = false;
    this.error = false;
  };

  var glucometer = new IHealthBG1();

  $scope.glucometer = glucometer;
  $scope.errors = {};
  $ionicPlatform.ready(function () {
    $scope.errors = ihealth.ERROR_CODES;
  });

  $scope.$on('ihealthstatus', function (e, info) {
    var status = info.status,
      data = info.data;
    console.log(status, data);
    switch (status) {
      case 'connect': {
        glucometer.reset();
        glucometer.connect = true;
        break;
      }
      case 'ready': {
        glucometer.ready = true;
        break;
      }
      case 'stripIn': {
        glucometer.stripIn = true;
        break;
      }
      case 'blood': {
        glucometer.blood = true;
        break;
      }
      case 'result': {
        glucometer.result = data;
        break;
      }
      case 'stripOut': {
        glucometer.stripIn = false;
        break;
      }
      case 'error': {
        glucometer.error = data ? data.status : null;
        break;
      }
      case 'disconnect': {
        glucometer.reset();
        break;
      }
    }
    $scope.$apply();
  })
});

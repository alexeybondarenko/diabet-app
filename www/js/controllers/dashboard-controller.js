'use strict';

angular.module('app').factory('IHealthBG1', function () {
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
  return IHealthBG1;
});

angular.module('app').controller('DashboardController', function ($scope, $ionicPlatform, $ionicModal, $ionicPopup,
                                                                  lodash, IHealthBG1, Measurements, Measurement) {
  $scope.measurements = null;

  function updateMeasurements () {
    $scope.measurements = Measurements.all();
  }

  updateMeasurements();

  $scope.glucometer = new IHealthBG1();
  $scope.errors = {};

  $ionicPlatform.ready(function () {
    $scope.errors = typeof ihealth !== 'undefined' ? ihealth.ERROR_CODES : {};
  });

  $scope.modal = null;
  $ionicModal.fromTemplateUrl('templates/modals/add-from-bg1.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  var resultTemplate = lodash.template('Your result is {{result}} mg/dL');

  $scope.$on('ihealthstatus', function (e, info) {
    var status = info.status,
      data = info.data;
    switch (status) {
      case 'connect': {
        $scope.modal.show();
        $scope.glucometer.reset();
        $scope.glucometer.connect = true;
        break;
      }
      case 'disconnect': {
        $scope.modal.hide();
        $scope.glucometer.reset();
        $scope.glucometer.connect = false;
        break;
      }
      case 'ready': {
        $scope.glucometer.ready = true;
        break;
      }
      case 'stripIn': {
        $scope.glucometer.stripIn = true;
        $scope.glucometer.blood = false;
        $scope.glucometer.result = null;
        break;
      }
      case 'stripOut': {
        $scope.glucometer.stripIn = false;
        $scope.glucometer.blood = false;
        $scope.glucometer.result = null;
        break;
      }
      case 'blood': {
        $scope.glucometer.blood = true;
        break;
      }
      case 'result': {
        $scope.glucometer.result = data ? data.result : null;
        $scope.modal.hide();
        var measurement = new Measurement();
        measurement.value = $scope.glucometer.result;
        Measurements.add(measurement);

        updateMeasurements();

        $ionicPopup.alert({
          title: 'Result',
          template: resultTemplate({result: $scope.glucometer.result})
        });

        break;
      }
    }
    $scope.$apply();
  });

});

'use strict';

angular.module('app').controller('DashboardController', function ($scope, $timeout, $ionicPlatform, $ionicModal, $ionicPopup,
                                                                  lodash, IHealthBG1, Measurements, Measurement, moment) {
  $scope.measurements = null;

  function updateMeasurements() {
    $scope.measurements = Measurements.all();
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    updateMeasurements();
  });

  $scope.formatDate = function (date) {
    return moment(date).format('l');
  };

  var last7DayStart = moment().startOf('day').subtract(1,'week');
  var todayEndOfRange =  moment().endOf('day').subtract(0,'day');
  $scope.filterWeekly = lodash.memoize(function (items) {
    var res = items.filter(function (item) {
      return moment(item.date).isBetween(last7DayStart, todayEndOfRange);
    });
    console.log(items, res);
    return res;
  });
  $scope.chartOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        position: "bottom",
        time: {
          // Moment js for each of the units. Replaces `displayFormat`
          // To override, use a pattern string from http://momentjs.com/docs/#/displaying/format/
          displayFormats: {
            'millisecond': 'SSS [ms]',
            'second': 'h:mm:ss', // 11:20:01 AM
            'minute': 'h:mm:ss', // 11:20:01 AM
            'hour': 'MMM D, hA', // Sept 4, 5PM
            'day': 'll', // Sep 4 2015
            'week': 'll', // Week 46, or maybe "[W]WW - YYYY" ?
            'month': 'MMM YYYY', // Sept 2015
            'quarter': '[Q]Q - YYYY', // Q3
            'year': 'YYYY' // 2015
          },
          // Sets the display format used in tooltip generation
          tooltipFormat: ''
        },
        ticks: {
          callback: function(dataLabel, index) {
            return index % 2 === 0 ? dataLabel : '';
          }
        }
      }],
      yAxes: [{
        display: true,
        beginAtZero: false
      }]
    },
    legend: {
      display: false
    }
  }

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
      case 'connect':
      {
        $scope.modal.show();
        $scope.glucometer.reset();
        $scope.glucometer.connect = true;
        break;
      }
      case 'disconnect':
      {
        $scope.modal.hide();
        $scope.glucometer.reset();
        $scope.glucometer.connect = false;
        break;
      }
      case 'ready':
      {
        $scope.glucometer.ready = true;
        break;
      }
      case 'stripIn':
      {
        $scope.glucometer.stripIn = true;
        $scope.glucometer.blood = false;
        $scope.glucometer.result = null;
        break;
      }
      case 'stripOut':
      {
        $scope.glucometer.stripIn = false;
        $scope.glucometer.blood = false;
        $scope.glucometer.result = null;
        break;
      }
      case 'blood':
      {
        $scope.glucometer.blood = true;
        break;
      }
      case 'result':
      {
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

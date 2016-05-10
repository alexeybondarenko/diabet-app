'use strict';


angular.module('app').directive('chartLine', function () {

  return {
    restrict: 'E',
    scope: {
      options: '=',
      keyX: '@',
      keyY: '@',
      formatKeyX: '=',
      formatKeyY: '=',
      modelData: '=data'
    },
    template: '<canvas class="chart chart-line" chart-data="data" chart-labels="labels" series="series" options="options"></canvas>',
    link: function (scope) {
      scope.data = [];
      scope.$watchCollection('modelData', function (item) {
        scope.data = getData(item);
        scope.labels = getLabels(item);
      });
      scope.labels = [];
      scope.series = [''];

      function getLabels (data) {
        if (!data) return;
        return (data || []).map(function (item) {
          return scope.formatKeyX ? scope.formatKeyX(item[scope.keyX]) : item[scope.keyX];
        });
      }
      function getData (data) {
        if (!data) return;
        return [(data || []).map(function (item) {
          return scope.formatKeyY ? scope.formatKeyY(item[scope.keyY]) : item[scope.keyY];
        })];
      }

    }
  }
});

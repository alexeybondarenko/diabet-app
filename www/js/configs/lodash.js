'use strict';

angular.module('app').run(function (lodash) {
  lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
});

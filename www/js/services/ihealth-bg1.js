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

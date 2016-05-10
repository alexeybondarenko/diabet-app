'use strict';

angular.module('app').factory('Measurement', function () {

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function Measurement (options) {

    var obj = options ? angular.copy(options) : {};

    this.id = obj.id || guid();
    this.value = obj.value;
    this.date = obj.date ? new Date(obj.date) : new Date();

    this.comment = obj.comment;
  }

  return Measurement;
});
angular.module('app').service('Measurements', function ($localStorage, Measurement) {


  var storage = $localStorage.$default({
    measurements: []
  });

  this.all = function () {
    return storage.measurements.map(function (item) {

      var res = new Measurement(item);
      return res;
    });
  };
  this.add = function (item) {
    storage.measurements.push(item);
  };
  this.remove = function (removeItem) {
    storage.measurements.filter(function (item) {
      return item.id !== removeItem.id;
    });
    return storage.measurements;
  };

});

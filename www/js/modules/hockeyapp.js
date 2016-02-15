'use strict';

angular.module('ngHockeyapp', []).service('$hockeyapp', function ($q) {

  // add promise wrap

  if (typeof hockeyapp === 'undefined') {
    var self = {};
    self.loginMode = {};
    ['start', 'feedback','checkForUpdate','addMetaData', 'forceCrash'].forEach(function (item) {
      self[item] = function () {
        return $q.reject(new Error('undefined hockeyapp'))
      };
    });
    return self;
  }

  this.loginMode = hockeyapp.loginMode;
  this.start = function (options) {

    var defer = $q.defer();

    options = angular.extend({
      appId: null,
      autoSend: true,
      ignoreDefaultHandler: true,
      loginMode: this.loginMode.ANONYMOUS,
      appSecret: null
    }, options);

    var self = this;
    hockeyapp.start(function () {
      defer.resolve.call(self, arguments);
    }, function () {
      defer.reject.call(self, arguments);
    });

    return defer.promise;
  };

  ['feedback','checkForUpdate','addMetaData'].forEach(function (item) {

    this[item] = function () {

      var defer = $q.defer();

      var args = Array.prototype.slice.call(arguments);
      var self = this;

      args[0] = function () {
        defer.resolve.call(self, arguments);
      };
      args[1] = function () {
        defer.resolve.call(self, arguments);
      };
      hockeyapp[item].apply(this, args);

      return defer.promise;
    }
  }.bind(this));

  this.forceCrash = function () {
    return hockeyapp.forceCrash();
  };

});

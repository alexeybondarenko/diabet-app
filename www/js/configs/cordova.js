'use strict';

angular.module('app').run(function ($ionicPlatform, $rootScope, $log) {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Now safe to use device APIs
    $log.debug('device ready');

    window.addEventListener('ihealthstatus', function (data) {
      console.log('ihealth status', JSON.stringify(data));
      switch (data.status) {
        case 'init': {
          break;
        }
        case 'verify': {
          break;
        }
        case 'plugged': {
          break;
        }
        case 'idps': {
          break;
        }
        case 'connect': {
          break;
        }
        case 'sendCodeBlock': {
          break;
        }
        case 'stripIn': {
          break;
        }
        case 'blood': {
          break;
        }
        case 'result': {
          break;
        }
        case 'stripOut': {
          break;
        }
        case 'error': {
          break;
        }
      }
    }, false);
    window.addEventListener('ihealthconnect', function (data) {
      console.log('ihealth connect', JSON.stringify(data));
      $rootScope.$apply(function () {
        $rootScope.connected = true;
      })
    }, false);
    window.addEventListener('ihealthdisconnect', function (data) {
      console.log('ihealth disconnect', JSON.stringify(data));
      $rootScope.$apply(function () {
        $rootScope.connected = false;
      })
    }, false);
  }


  $ionicPlatform.ready(function () {
    $log.debug('platform ready');
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});

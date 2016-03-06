'use strict';

angular.module('app').run(function ($ionicPlatform, $log) {

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    // Now safe to use device APIs
    $log.debug('device ready');

    window.addEventListener('ihealthstatus', function (data) {
      console.log('ihealth', JSON.stringify(data));
      if (data.name == 'connect') {
        alert('connect');
      }
      if (data.name == 'disconnect') {
        alert('disconnect');
      }
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

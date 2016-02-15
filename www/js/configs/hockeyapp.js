'use strict';

angular.module('app').run(function ($hockeyapp) {

  $hockeyapp.start({
    appId: 'adc3d6e74bbb44258fd93dc58e0816b1',
    appSecret: '2fbbaf3fcb79669f2835faaeb9091397'
  })

});

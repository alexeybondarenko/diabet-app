
var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');


var iHealth = function() {
};

iHealth.onEnable = null;
iHealth.onReady = null;
iHealth.onMeasured = null;

//Keyboard.close = function() {
//  exec(null, null, "Keyboard", "close", []);
//};

//Keyboard.disableScroll = function(disable) {
//  exec(null, null, "Keyboard", "disableScroll", [disable]);
//};

module.exports = iHealth;




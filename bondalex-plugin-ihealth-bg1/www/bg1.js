var exec = require('cordova/exec');
cordova = require('cordova');


var iHealth = function () {
  this.channels = {
    ihealthstatus: cordova.addWindowEventHandler("ihealthstatus")
  };
  for (var key in this.channels) {
    this.channels[key].onHasSubscribersChange = onHasSubscribersChange;
  }
};

function handlers() {
  return ihealth.channels.ihealthstatus.numHandlers;
}

function onHasSubscribersChange () {
  // If we just registered the first handler, make sure native listener is started.
  if (this.numHandlers === 1 && handlers() === 1) {
    exec(ihealth._status, ihealth._error, "iHealthBG1", "subscribe", []);
  } else if (handlers() === 0) {
    exec(null, null, "iHealthBG1", "unsubscribe", []);
  }
}

iHealth.prototype._status = function (info) {
  console.log('status', JSON.stringify(info));
  if (info) {
    cordova.fireWindowEvent("ihealthstatus", info);
  }
};

iHealth.prototype._error = function (e) {
  console.log("Error initializing iHealth: " + e);
};

var ihealth = new iHealth();

module.exports = ihealth;

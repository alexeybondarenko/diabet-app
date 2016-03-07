# bondalex-ihealth-bg1

Cordova plugin for iHealth BG1
 
## Platforms

- iOS

## Overview

Plugin use official iHealth SDK for iOS.

## TD;LR

```

window.addEventListener('ihealthstatus', function (resp) {
  var data = resp.data,
    status = resp.status;
    
  switch (status) {
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
    case 'disconnect': {
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
});

```

## TODO

- [ ] Android
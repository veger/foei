var debug;
chrome.storage.sync.get('debug', function (data) {
  debug = data.debug === true;
  console.log('debug', debug);
});
var trace;
chrome.storage.sync.get('trace', function (data) {
  trace = data.trace === true;
  console.log('trace', debug);
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'forgeofempires.com', pathEquals: '/game/index'}
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.hasOwnProperty('debug')) {
      setDebug(request.debug);
    }
    if (request.hasOwnProperty('trace')) {
      setTrace(request.trace);
    }
    if (request.hasOwnProperty('resend_messages')) {
      chrome.runtime.sendMessage(msgCache);
    }
  });

chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    if (request.jsonRequest) {
      if (trace) {
        console.log('request', request.jsonRequest);
      }
    }

    if (request.jsonResponse) {
      if (trace) {
        console.log('response', request.jsonResponse);
      }

      for (var i = 0; i < request.jsonResponse.length; i++) {
        response = request.jsonResponse[i];
        switch (response.requestClass) {
          case 'BattlefieldService':
            battleField.process(response.requestMethod, response.responseData, response.requestId);
            break;
          case 'CityMapService':
            cityMap.process(response.requestMethod, response.responseData, response.requestId);
            break;
          case 'GreatBuildingsService':
            greatBuilding.process(response.requestMethod, response.responseData, response.requestId);
            break;
          case 'HiddenRewardService':
            rewards.process(response.requestMethod, response.responseData, response.requestId);
            break;
          case 'OtherPlayerService':
            otherPlayer.process(response.requestMethod, response.responseData, response.requestId);
            break;
          case 'StartupService':
            startup.process(response.requestMethod, response.responseData, response.requestId);
          case 'TimeService':
            // Extremely not interesting
            break;
          default:
            if (trace || debug) {
              console.log(response.requestClass + '.' + response.requestMethod + ' is not used');
            }
        }
      }
    }
  });

function setDebug (value) {
  debug = value;
  chrome.storage.sync.set({debug: debug}, function () {
    console.log('debug', debug);
  });
}

function setTrace (value) {
  trace = value;
  chrome.storage.sync.set({trace: trace}, function () {
    console.log('trace', trace);
  });
}

'use strict'

var debug
localGet('_debug', function (data) {
  debug = data._debug === true
  console.log('debug', debug)
})
var trace
localGet('_trace', function (data) {
  trace = data._trace === true
  console.log('trace', trace)
})
localGet('_lastWorldID', function (result) {
  if (result._lastWorldID) {
    setWorldID(result._lastWorldID)
  }
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostContains: 'forgeofempires.com', pathEquals: '/game/index' }
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})

chrome.pageAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL('ui/ui.html') })
})

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.hasOwnProperty('debug')) {
      setDebug(request.debug)
    }
    if (request.hasOwnProperty('trace')) {
      setTrace(request.trace)
    }
    if (request.hasOwnProperty('resend_messages')) {
      chrome.runtime.sendMessage(msgCache)
    }
    if (request.hasOwnProperty('cache')) {
      cacheAction(request.cache)
    }
  })

chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    if (trace) {
      console.log('metadata', request.metadata)
      if (request.jsonRequest) {
        console.log('request', request.jsonRequest)
      }
      if (request.jsonResponse) {
        console.log('response', request.jsonResponse)
      }
    }

    if (request.metadata && request.metadata.world) {
      setWorldID(request.metadata.world)
    }

    if (request.jsonResponse) {
      switch (request.metadata.type) {
        case 'game':
          for (let i = 0; i < request.jsonResponse.length; i++) {
            const response = request.jsonResponse[i]
            switch (response.requestClass) {
              case 'BattlefieldService':
                battleField.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'CityMapService':
                cityMap.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'ClanBattleService':
                clanBattle.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'GreatBuildingsService':
                greatBuilding.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'HiddenRewardService':
                hiddenReward.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'OtherPlayerService':
                otherPlayer.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'ResourceService':
                resource.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'StartupService':
                startup.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'StaticDataService':
                staticData.process(response.requestMethod, response.responseData, response.requestId)
                break
              case 'TimeService':
                // Extremely not interesting
                break
              default:
                if (trace || debug) {
                  console.log(response.requestClass + '.' + response.requestMethod + ' is not used')
                }
            }
          }
          break
        case 'meta':
          switch (request.metadata.id) {
            default:
              if (debug) {
                console.log(`Not interested in ${request.metadata.id} metadata`)
              }
          }
          break
        default:
          console.error(`Unknown data type: ${request.metadata.type}`)
      }
    }
  })

function setDebug (value) {
  debug = value
  localSet({ _debug: debug }, function () {
    console.log('debug', debug)
  })
}

function setTrace (value) {
  trace = value
  localSet({ _trace: trace }, function () {
    console.log('trace', trace)
  })
}

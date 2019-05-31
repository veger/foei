'use strict'

const startup = {
  playerId: 0,
  process: function (method, data) {
    if (trace) {
      console.log('StartupService.' + method, data)
    }
    switch (method) {
      case 'getData':
        startup.setPlayerId(data.user_data.player_id)
        greatBuilding.checkArcBonus(data.city_map.entities)

        let goods = {}
        let goodsList = data.goodsList
        for (let i = 0; i < goodsList.length; i++) {
          goods[goodsList[i].id] = goodsList[i].era
        }
        startup.setGoods(goods)

        break
      default:
        if (trace || debug) {
          console.log('StartupService.' + method + ' is not used')
        }
    }
  },
  setPlayerId: function (playerId) {
    if (debug) {
      console.log('playerId', playerId)
    }
    localSet({ 'playerId': playerId })
    startup.playerId = playerId
  },
  setGoods: function (goods) {
    if (debug) {
      console.log(Object.keys(goods).length + ' goods registered')
    }
    localSet({ 'goods': goods })
    consts.goods = goods
    sendNotification('goods', '', '')
  },
  getGoods: function (cb) {
    if (consts.goods !== undefined) {
      cb(consts.goods)
    }

    // Handle goods not being available yet (eg during startup)
    localGet({ 'goods': {} }, function (result) {
      startup.setGoods(result.goods)
      cb(result.goods)
    })
  },
  checkRelease: function () {
    return fetch('https://api.github.com/repos/veger/foei/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(
        function (response) {
          if (response.status !== 200) {
            console.error('Failed to fetch latest release information: ', response.statusText)
            return
          }

          response.json().then(function (data) {
            let latestVersion = data.name
            if (latestVersion[0] === 'v') {
              latestVersion = latestVersion.substring(1)
            }
            let ownVersion = chrome.runtime.getManifest().version
            if (debug) {
              console.log(`Own version '${ownVersion}', latest version '${latestVersion}'`)
            }
            sendMessageCache({ version: { own: ownVersion, latest: latestVersion } })
          })
        }
      )
      .catch(function (err) {
        console.error('Error while trying to fetch release information: ', err)
      })
  }
}

listenToWorldIDChanged(function () {
  localGet({ 'goods': false, playerId: false }, function (result) {
    if (!result.goods) {
      sendNotification('goods', 'error', 'Goods not available, restart/refresh game')
    } else {
      startup.setGoods(result.goods)
    }
    if (result.playerId) {
      startup.playerId = result.playerId
    }
  })
})

startup.getGoods(function () { })
startup.checkRelease()

'use strict'

// TODO Remove obsolete entry in storage
localRemove('goods')

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
  localGet({ 'resources': false, playerId: false }, function (result) {
    if (!result.resources || Object.keys(result.resources).length === 0) {
      sendNotification('resources', 'error', 'Resources not available, restart/refresh game')
    } else {
      resource.set(result.resources)
    }
    if (result.playerId) {
      startup.playerId = result.playerId
    }
  })
})

resource.get(function () { })
startup.checkRelease()

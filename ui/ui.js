'use strict'

let currentGBRewards = { rewards: [] }
let resources = {}
let staticData = {}
let worldID = '<unknown>'

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.version) {
      checkVersion(request.version)
    }
    if (request.worldID) {
      worldID = request.worldID
    }
    if (request.staticData) {
      staticData = request.staticData
    }
    if (request.notifications) {
      updateNotifications(request.notifications)
    }
    if (request.resources) {
      resources = request.resources
    }
    if (request.worlds) {
      updateSettingsWorlds(request.worlds)
    }
    if (request.revenue) {
      updatePlunder(request.revenue)
    }
    if (request.incidents) {
      updateIncidents(request.incidents)
    }
    if (request.battleStats) {
      updateBattleStats(request.battleStats)
    }
    if (request.clanArmies) {
      updateClanArmies(request.clanArmies)
    }
    if (request.playerProtected !== undefined) {
      updatePlayerProtection(request.playerProtected)
    }
    if (request.gbFpAnalysis) {
      currentGBRewards = request.gbFpAnalysis
      updateGreatBuildingAnalysis(request.gbFpAnalysis.analysis, request.gbFpAnalysis.selfOwner)
      updateGreatBuildingBoostInfo(request.gbFpAnalysis)
    }
    if (request.playerGBChanges) {
      updateGreatBuildingChanges(request.playerGBChanges)
    }
    if (request.cacheData) {
      const file = new File([JSON.stringify(request.cacheData.data)], 'foei-' + request.cacheData.worldID + '.json', { type: 'application/json;charset=utf-8' })
      saveAs(file)
    }
  }
)
chrome.extension.sendMessage({ resend_messages: true })

function humanReadableTime (seconds) {
  const hours = Math.floor(seconds / 3600)
  seconds -= hours * 3600
  const minutes = '0' + Math.floor(seconds / 60)
  seconds -= minutes * 60
  seconds = '0' + Math.floor(seconds)
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}

function getNotificationBootstrapClass (type) {
  const notificationTypes2Bootstrap = {
    info: 'info',
    warning: 'warning',
    error: 'danger'
  }
  return notificationTypes2Bootstrap[type] || 'danger'
}

function checkVersion (versionInfo) {
  $('#foei-version').text(versionInfo.own)
  if (versionInfo.own !== versionInfo.latest) {
    $('#update').html(`<div class="alert alert-warning alert-dismissible fade show">
    A new version of FoEI is available: <em><a id="release-version" href="https://www.vegerweb.nl/foei">${versionInfo.latest}</a></em>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  </div>`)
  }
}

function updateNotifications (notifications) {
  let html = ''
  for (const id in notifications) {
    html += '<div class="alert alert-' + getNotificationBootstrapClass(notifications[id].type) + '"">' + notifications[id].msg + '</div>'
  }
  $('#notifications').html(html)
}

const worldRegex = RegExp(/([a-z]*)/)
function getStaticData (type) {
  const lang = worldRegex.exec(worldID)[0]
  if (!(staticData[lang] && staticData[lang][type])) {
    return {}
  }

  const hash = staticData[lang][type].worldHashes[worldID]
  if (hash && staticData[lang][type].hashes[hash]) {
    return staticData[lang][type].hashes[hash].data
  }
  return {}
}

function addTab (barParent, bodyParent, id, title, body) {
  const active = $('#' + barParent + ' li').length === 0
  const barHTML = '<li class="nav-item"><a class="nav-link' + (active ? ' active show' : '') + '" id="' + id + '-tab" data-toggle="tab" href="#' + id + '" role="tab" aria-controls="' + id + '" aria-selected="false">' + title + '</a></li>'
  const bodyHTML = '<div class="tab-pane fade' + (active ? 'show active' : '') + '" id="' + id + '" role="tabpanel" aria-labelledby="' + id + '-tab">' + body + '</div>'

  $('#' + barParent).append(barHTML)
  $('#' + bodyParent).append(bodyHTML)
}

$('#boost-factor').change(function () {
  updateGreatBuildingBoostInfo(currentGBRewards)
})
$('#boost-factor').on('input', function () {
  updateGreatBuildingBoostInfo(currentGBRewards)
})

$('body').tooltip({
  selector: '[data-toggle="tooltip"]'
})

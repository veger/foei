let rewardUpdateInterval

function updateIncidents (incidents) {
  clearInterval(rewardUpdateInterval)
  const start = new Date().getTime()

  if (incidents.length > 0) {
    rewardUpdateInterval = setInterval(function () {
      const now = new Date().getTime()
      updateIncidentsDetails((now - start) / 1000, incidents)
    }, 500)
  }
}

function updateIncidentsDetails (timePassed, incidents) {
  let incidentsRows = ''
  let hasActiveUncommon = false
  let hasActive = false
  let hasInactive = false
  for (let i = 0; i < incidents.length; i++) {
    incidentsRows += addRewardRow(timePassed, incidents[i])
    if (incidents[i].startTime - timePassed < 1 && incidents[i].expireTime - timePassed > 0) {
      hasActive = true
      hasActiveUncommon |= isUncommon(incidents[i])
    } else {
      hasInactive = true
    }
  }
  if (incidentsRows === '') {
    incidentsRows = '<td colspan="4">No incidents available</td>'
  }
  $('#incidents-body').html(incidentsRows)

  updateIncidentsTab(hasActive, hasActiveUncommon)

  if (!hasInactive && !hasActive) {
    // Nothing to update anymore, so stop timer
    clearInterval(rewardUpdateInterval)
    rewardUpdateInterval = undefined
  }
}

function updateIncidentsTab (active, uncommon) {
  $('#incidents-tab').html((active ? '<i style="color: ' + (uncommon ? 'green' : 'orange') + '" class="fas fa-exclamation-triangle"></i> ' : '') + 'Incidents')
}

function addRewardRow (timePassed, reward) {
  let activeInfo
  if (isActive(reward.startTime, timePassed)) {
    activeInfo = humanReadableTime(reward.startTime - timePassed)
  } else {
    activeInfo = '<i style="color: green" class="fas fa-check"></i><br/><small>(' + humanReadableTime(reward.expireTime - timePassed) + ')</small>'
  }

  const row = '<tr><td class="text-center">' + activeInfo + '</td><td>' + reward.rarity + '</td><td>' + rewardType(reward.type) + '</td><td>' + reward.worldID + '</td><td>' + reward.position + '</td></tr>'

  return row
}

function isUncommon (reward) {
  return reward.rarity === 'uncommon' || reward.rarity === 'special' || reward.type === 'ge_relic_rare' || reward.type === 'ge_relic_uncommon'
}

function isActive (startTime, timePassed) {
  return startTime - timePassed > 1
}

function rewardType (type) {
  if (Object.prototype.hasOwnProperty.call(incidents, type)) {
    return '<img style="height:50px;" title="' + type + '" src="/ui/icons/hr/' + type + '.png"></td><td>' + incidents[type]
  }
  return '</td><td>' + type
}

const incidents = {
  ge_relic_rare: 'rare relic',
  ge_relic_common: 'common relic',
  ge_relic_uncommon: 'uncommon relic',
  incident_beehive: 'beehive',
  incident_broken_cart: 'broken cart',
  incident_crates: 'crates',
  incident_blocked_road_1x1: 'blocked small road',
  incident_blocked_road_2x2: 'blocked big road',
  incident_castaway: 'castaway',
  incident_clothesline: 'clothesline',
  incident_dinosaur_bones: 'dinosaur bones',
  incident_fallen_tree_1x1: 'fallen tree',
  incident_fallen_tree_2x2: 'fallen tree',
  incident_fisherman: 'fisherman',
  incident_fruit_vendor: 'fruit vendor',
  incident_flotsam: 'flotsam',
  incident_kite: 'kite in tree',
  incident_mammoth_bones: 'mammoth bones',
  incident_musician: 'musician',
  incident_overgrowth: 'overgrowth',
  incident_pothole_1x1: 'small pothole',
  incident_pothole_2x2: 'big pothole',
  incident_rhino: 'rhino',
  incident_sculptor: 'sculptor',
  incident_shipwreck: 'shipwreck',
  incident_sos: 'SOS',
  incident_statue: 'statue',
  incident_stick_hut: 'stick hut',
  incident_treasure_chest: 'treasure chest',
  incident_wine_cask: 'wine casks',
  spring_cherry_tree: 'cherry tree'
}

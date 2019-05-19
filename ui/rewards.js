let rewardUpdateInterval

function updateRewards (rewards) {
  clearInterval(rewardUpdateInterval)
  let start = new Date().getTime()

  if (rewards.length > 0) {
    rewardUpdateInterval = setInterval(function () {
      let now = new Date().getTime()
      updateRewardsDetails((now - start) / 1000, rewards)
    }, 500)
  }
}

function updateRewardsDetails (timePassed, rewards) {
  let rewardsRows = ''
  let hasActiveUncommon = false
  let hasActive = false
  let hasInactive = false
  for (let i = 0; i < rewards.length; i++) {
    rewardsRows += addRewardRow(timePassed, rewards[i])
    if (rewards[i].startTime - timePassed < 1 && rewards[i].expireTime - timePassed > 0) {
      hasActive = true
      hasActiveUncommon |= isUncommon(rewards[i])
    } else {
      hasInactive = true
    }
  }
  if (rewardsRows === '') {
    rewardsRows = '<td colspan="4">No rewards available</td>'
  }
  $('#rewards-body').html(rewardsRows)

  updateRewardsTab(hasActive, hasActiveUncommon)

  if (!hasInactive && !hasActive) {
    // Nothing to update anymore, so stop timer
    clearInterval(rewardUpdateInterval)
    rewardUpdateInterval = undefined
  }
}

function updateRewardsTab (active, uncommon) {
  $('#rewards-tab').html((active ? '<i style="color: ' + (uncommon ? 'green' : 'orange') + '" class="fas fa-exclamation-triangle"></i> ' : '') + 'Rewards')
}

function addRewardRow (timePassed, reward) {
  let activeInfo
  if (isActive(reward.startTime, timePassed)) {
    activeInfo = humanReadableTime(reward.startTime - timePassed)
  } else {
    activeInfo = '<i style="color: green" class="fas fa-check"></i><br/><small>(' + humanReadableTime(reward.expireTime - timePassed) + ')</small>'
  }

  let row = '<tr><td class="text-center">' + activeInfo + '</td><td>' + reward.rarity + '</td><td>' + rewardType(reward.type) + '</td><td>' + reward.worldID + '</td><td>' + reward.position + '</td></tr>'

  return row
}

function isUncommon (reward) {
  return reward.rarity === 'uncommon' || reward.rarity === 'special' || reward.type === 'ge_relic_rare' || reward.type === 'ge_relic_uncommon'
}

function isActive (startTime, timePassed) {
  return startTime - timePassed > 1
}

function rewardType (type) {
  if (incidents.hasOwnProperty(type)) {
    return '<img style="height:50px;" title="' + type + '" src="/ui/icons/hr/' + type + '.png"></td><td>' + incidents[type]
  }
  return '</td><td>' + type
}

const incidents = {
  'ge_relic_rare': 'rare relic',
  'ge_relic_common': 'common relic',
  'ge_relic_uncommon': 'uncommon relic',
  'incident_beehive': 'beehive',
  'incident_broken_cart': 'broken cart',
  'incident_crates': 'crates',
  'incident_blocked_road_1x1': 'blocked small road',
  'incident_blocked_road_2x2': 'blocked big road',
  'incident_castaway': 'castaway',
  'incident_clothesline': 'clothesline',
  'incident_dinosaur_bones': 'dinosaur bones',
  'incident_fallen_tree_1x1': 'fallen tree',
  'incident_fallen_tree_2x2': 'fallen tree',
  'incident_fisherman': 'fisherman',
  'incident_fruit_vendor': 'fruit vendor',
  'incident_flotsam': 'flotsam',
  'incident_kite': 'kite in tree',
  'incident_mammoth_bones': 'mammoth bones',
  'incident_musician': 'musician',
  'incident_overgrowth': 'overgrowth',
  'incident_pothole_1x1': 'small pothole',
  'incident_pothole_2x2': 'big pothole',
  'incident_rhino': 'rhino',
  'incident_sculptor': 'sculptor',
  'incident_shipwreck': 'shipwreck',
  'incident_sos': 'SOS',
  'incident_statue': 'statue',
  'incident_stick_hut': 'stick hut',
  'incident_treasure_chest': 'treasure chest',
  'incident_wine_cask': 'wine casks',
  'spring_cherry_tree': 'cherry tree'
}

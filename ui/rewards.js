var rewardUpdateInterval;

function updateRewards (rewards) {
  clearInterval(rewardUpdateInterval);
  var start = new Date().getTime();

  if (rewards.length > 0) {
    rewardUpdateInterval = setInterval(function () {
      var now = new Date().getTime();
      updateRewardsDetails((now - start) / 1000, rewards);
    }, 500);
  }
}

function updateRewardsDetails (timePassed, rewards) {
  rewardsRows = '';
  hasActive = false;
  hasInactive = false;
  for (var i = 0; i < rewards.length; i++) {
    rewardsRows += addRewardRow(timePassed, rewards[i]);
    if (rewards[i].active !== true) {
      if (secondsTime(rewards[i].active) - timePassed < 1) {
        hasActive = true;
      } else {
        hasInactive = true;
      }
    } else {
      hasActive = true;
    }
  }
  if (rewardsRows == '') {
    rewardsRows = '<td colspan="4">No rewards available</td>';
  }
  $('#rewards-body').html(rewardsRows);

  updateRewardsTab(hasActive);
  if (!hasInactive) {
    clearInterval(rewardUpdateInterval);
    rewardUpdateInterval = undefined;
  }
}

function updateRewardsTab (active) {
  $('#rewards-tab').html((active ? '<i style="color: orange" class="fas fa-exclamation-triangle"></i> ' : '') + 'Rewards');
}

function addRewardRow (timePassed, reward) {
  activeInfo = '<i style="color: green" class="fas fa-check"></i>';
  if (hasRowTime(reward.active, timePassed)) {
    activeInfo = humanReadableTime(secondsTime(reward.active) - timePassed);
  }

  row = '<tr><td>' + activeInfo + '</td><td>' + reward.rarity + '</td><td>' + rewardType(reward.type) + '</td><td>' + reward.position + '</td></tr>';

  return row;
}

function hasRowTime (active, timePassed) {
  if (active === true) {
    return false;
  }
  return secondsTime(active) - timePassed > 1;
}

function rewardType (type) {
  if (incidents.hasOwnProperty(type)) {
    return '<img style="height:50px;" title="' + type + '" src="/ui/icons/hr/' + type + '.png"></td><td>' + incidents[type];
  }
  return '</td><td>' + type;
}

var incidents = {
  'ge_relic_rare': 'rare relic',
  'incident_beehive': 'beehive',
  'incident_broken_cart': 'broken cart',
  'incident_crates': 'crates',
  'incident_blocked_road_2x2': 'blocked road',
  'incident_clothesline': 'clothesline',
  'incident_fallen_tree_2x2': 'fallen tree',
  'incident_flotsam': 'flotsam',
  'incident_kite': 'kite in tree',
  'incident_pothole_2x2': 'pothole'
};

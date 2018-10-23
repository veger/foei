rewards = {
  rawRewards: [],
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'getOverview':
        // Remove rewards of current world...
        world = worldID.slice(0, -1); // remove '-'
        rewards.rawRewards = rewards.rawRewards.filter(function (i) {
          return i.worldID !== world;
        });
        // ... and add received ones back
        for (var i = 0; i < data.hiddenRewards.length; i++) {
          rawReward = data.hiddenRewards[i];
          rawReward.worldID = world;
          rewards.rawRewards.push(rawReward);
        }

        parsedRewards = rewards.parseRewards();
        parsedRewards = sortByKey(parsedRewards, 'startTime');
        if (debug) {
          console.log('Hidden rewards', parsedRewards);
        }
        sendMessageCache({ 'rewards': parsedRewards });
        break;
      default:
        if (trace || debug) {
          console.log('rewardsService.' + method + ' is not used');
        }
    }
  },
  parseRewards: function () {
    parseRewards = [];
    var now = Date.now() / 1000;
    for (var i = 0; i < rewards.rawRewards.length; i++) {
      reward = rewards.rawRewards[i];
      startDiff = reward.startTime - now;
      active = true;
      if (startDiff > 0) {
        active = humanReadableTime(startDiff);
      }

      reward = {
        worldID: reward.worldID,
        startTime: reward.startTime - now,
        expireTime: reward.expireTime - now,
        rarity: reward.rarity,
        type: reward.type,
        position: reward.position.context
      };
      parseRewards.push(reward);
    }
    return parseRewards;
  }
};

hiddenReward = {
  rawRewards: [],
  process: function (method, data) {
    if (trace) {
      console.log('HiddenRewardService.' + method, data);
    }
    switch (method) {
      case 'getOverview':
        // Remove rewards of current world...
        world = worldID.slice(0, -1); // remove '-'
        hiddenReward.rawRewards = hiddenReward.rawRewards.filter(function (i) {
          return i.worldID !== world;
        });
        // ... and add received ones back
        for (var i = 0; i < data.hiddenRewards.length; i++) {
          rawReward = data.hiddenRewards[i];
          rawReward.worldID = world;
          hiddenReward.rawRewards.push(rawReward);
        }

        parsedRewards = hiddenReward.parseRewards();
        parsedRewards = parsedRewards.sort(sortByKey('startTime'));
        if (debug) {
          console.log('Hidden rewards', parsedRewards);
        }
        sendMessageCache({ 'rewards': parsedRewards });
        break;
      default:
        if (trace || debug) {
          console.log('HiddenRewardService.' + method + ' is not used');
        }
    }
  },
  parseRewards: function () {
    parseRewards = [];
    var now = Date.now() / 1000;
    for (var i = 0; i < hiddenReward.rawRewards.length; i++) {
      reward = hiddenReward.rawRewards[i];
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

rewards = {
  parsedReward: [],
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'getOverview':

        // Remove rewards of current world...
        world = worldID.slice(0, -1); // remove '-'
        rewards.parsedReward = rewards.parsedReward.filter(function (i) {
          return i.worldID !== world;
        });

        // ... and add received ones back
        var now = Date.now() / 1000;
        for (var i = 0; i < data.hiddenRewards.length; i++) {
          reward = data.hiddenRewards[i];
          startDiff = reward.startTime - now;
          active = true;
          if (startDiff > 0) {
            active = humanReadableTime(startDiff);
          }

          reward = {
            worldID: world,
            active: active,
            expire: humanReadableTime(reward.expireTime - now),
            rarity: reward.rarity,
            type: reward.type,
            position: reward.position.context
          };
          if (active === true) {
            rewards.parsedReward.unshift(reward);
          } else {
            rewards.parsedReward.push(reward);
          }
        }
        rewards.parsedReward = sortByKey(rewards.parsedReward, 'active', 'expired');
        if (debug) {
          console.log('Hidden rewards', rewards.parsedReward);
        }
        sendMessageCache({ 'rewards': rewards.parsedReward });
        break;
      default:
        if (trace || debug) {
          console.log('rewardsService.' + method + ' is not used');
        }
    }
  }
};

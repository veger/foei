rewards = {
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'getOverview':
        parsedReward = [];
        var now = Date.now() / 1000;
        for (var i = 0; i < data.hiddenRewards.length; i++) {
          reward = data.hiddenRewards[i];
          startDiff = reward.startTime - now;
          active = true;
          if (startDiff > 0) {
            active = humanReadableTime(startDiff);
          }

          reward = {
            active: active,
            expire: humanReadableTime(reward.expireTime - now),
            rarity: reward.rarity,
            type: reward.type,
            position: reward.position.context
          };
          if (active === true) {
            parsedReward.unshift(reward);
          } else {
            parsedReward.push(reward);
          }
        }
        parsedReward = sortByKey(parsedReward, 'active', 'expired');
        if (debug) {
          console.log('Hidden rewards', parsedReward);
        }
        sendMessageCache({ 'rewards': parsedReward });
        break;
      default:
        if (trace || debug) {
          console.log('rewardsService.' + method + ' is not used');
        }
    }
  }
};

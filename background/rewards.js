rewards = {
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'getOverview':
        parsedReward = [];
        for (var i = 0; i < data.hiddenRewards.length; i++) {
          reward = data.hiddenRewards[i];
          startDiff = reward.startTime - Date.now() / 1000;
          active = true;
          if (startDiff > 0) {
            active = humanReadableTime(startDiff);
          }
          parsedReward.push({
            active: active,
            rarity: reward.rarity,
            type: reward.type,
            position: reward.position.context
          });
        }
        parsedReward = sortByKey(parsedReward, 'active');
        console.warn('Hidden rewards', parsedReward);
        sendMessageCache({ 'rewards': parsedReward });
        break;
      default:
        if (trace || debug) {
          console.log(method + ' is not used');
        }
    }
  }
};

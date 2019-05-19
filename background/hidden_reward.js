'use strict'

const hiddenReward = {
  rawRewards: [],
  process: function (method, data) {
    if (trace) {
      console.log('HiddenRewardService.' + method, data)
    }
    switch (method) {
      case 'getOverview':
        // Remove rewards of current world...
        let world = worldID.slice(0, -1) // remove '-'
        hiddenReward.rawRewards = hiddenReward.rawRewards.filter(function (i) {
          return i.worldID !== world
        })
        // ... and add received ones back
        for (let i = 0; i < data.hiddenRewards.length; i++) {
          let rawReward = data.hiddenRewards[i]
          rawReward.worldID = world
          hiddenReward.rawRewards.push(rawReward)
        }

        let parsedRewards = hiddenReward.parseRewards()
        parsedRewards = parsedRewards.sort(sortByKey('startTime'))
        if (debug) {
          console.log('Hidden rewards', parsedRewards)
        }
        sendMessageCache({ 'rewards': parsedRewards })
        break
      default:
        if (trace || debug) {
          console.log('HiddenRewardService.' + method + ' is not used')
        }
    }
  },
  parseRewards: function () {
    let parseRewards = []
    let now = Date.now() / 1000
    for (let i = 0; i < hiddenReward.rawRewards.length; i++) {
      let reward = hiddenReward.rawRewards[i]

      reward = {
        worldID: reward.worldID,
        startTime: reward.startTime - now,
        expireTime: reward.expireTime - now,
        rarity: reward.rarity,
        type: reward.type,
        position: reward.position.context
      }
      parseRewards.push(reward)
    }
    return parseRewards
  }
}

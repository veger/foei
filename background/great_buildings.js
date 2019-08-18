'use strict'

const greatBuilding = {
  requestId: -1,
  requiredFP: 0,
  ownerId: -1,
  arcBonus: 0,
  process: function (method, data, id) {
    if (trace) {
      console.log('GreatBuildingsService.' + method, data)
    }
    switch (method) {
      case 'getConstruction':
      case 'contributeForgePoints':
        if (greatBuilding.requestId !== id) {
          console.error('Wrong id ' + id + ', expected ' + greatBuilding.requestId)
          return
        }

        let gbFpAnalysis = greatBuilding.performAnalysis(method === 'getConstruction' ? data.rankings : data)

        if (debug) {
          console.log(gbFpAnalysis)
        }

        sendMessageCache({ gbFpAnalysis: gbFpAnalysis })
        break
      case 'getOtherPlayerOverview':
        greatBuilding.checkGBChanges(data, function (changes) {
          if (debug) {
            console.log('playerGBChanges', changes)
          }

          sendMessageCache({ playerGBChanges: changes })
        })
        break
      default:
        if (trace || debug) {
          console.log('GreatBuildingsService.' + method + ' is not used')
        }
    }
  },
  performAnalysis: function (dataRankings) {
    let investedFP = 0
    let selfFP = 0
    let selfIndex
    let ownerFP = 0
    let ownerIndex

    // Remove player (self) from rankings as this messes the calculations
    // (it is an investment that is already done on behalf of the player)
    let rankings = []
    for (let i = 0; i < dataRankings.length; i++) {
      let ranking = Object.assign({}, dataRankings[i])
      rankings.push(ranking)

      const forgePoints = ranking.forge_points
      if (selfIndex !== undefined) {
        // Move all other investments one up, to remove the self investment
        rankings[i - 1].forge_points = rankings[i].forge_points
        rankings[i - 1].player = rankings[i].player
      }

      if (forgePoints) {
        if (ranking.player.player_id === greatBuilding.ownerId) {
          ownerIndex = i
          ownerFP = forgePoints
        }
        if (ranking.player.is_self) {
          selfIndex = i
          selfFP = forgePoints
        } else {
          // Only count non-self investments, they do not influence the calculations
          investedFP += forgePoints
        }
      }
    }
    if (selfIndex !== undefined) {
      // Remove last investment, as they all moved up by one
      rankings[rankings.length - 1].forge_points = undefined
      rankings[rankings.length - 1].player = {}
    }
    let freeFP = (greatBuilding.requiredFP - investedFP)

    if (debug) {
      console.log('free FP (excluding self): ' + freeFP)
      console.log('self (#' + (selfIndex + 1) + '): ' + selfFP)
      console.log('owner (#' + (ownerIndex + 1) + '): ' + ownerFP)
    }

    let fpAnalysis = []
    // Check if owner is self -> skip as it/nothing makes sense (anymore)
    if (greatBuilding.ownerId !== startup.playerId) {
      let i = -1
      while (i < rankings.length - 1) {
        i++
        let ranking = rankings[i]
        let rank = ranking.rank

        if (ranking.reward === undefined) {
          // Nothing to calculate
          continue
        }

        let investedByOthers = 0
        let bestSpotFP = greatBuilding.requiredFP
        let j = i + 1
        while (j >= 1) {
          j--
          if (rankings[j].player.player_id !== greatBuilding.ownerId) {
            investedByOthers += (rankings[j].forge_points || 0)
          } else if (j === selfIndex && j + 1 < rankings.length) {
            // In order to calculate the 'self' spot (directly above owner spot), we'll have to grab next spot (as this is direct 'competitor')
            investedByOthers += (rankings[j + 1].forge_points || 0)
          } else {
            // Ignore owner spot
            continue
          }

          let tmp = Math.ceil((freeFP + investedByOthers + j - i) / (i - j + 2))
          if (tmp <= rankings[j].forge_points) {
            tmp = rankings[j].forge_points + 1
          }

          if (tmp < bestSpotFP) {
            bestSpotFP = tmp
          }
        }

        if (rank > 5 || bestSpotFP > freeFP || bestSpotFP < selfFP || bestSpotFP === 0) {
          // Used for Boost information
          fpAnalysis.push({
            spotSafe: false,
            reward: {
              fp: ranking.reward.strategy_point_amount,
              fpBonus: Math.round(fixFloat(ranking.reward.strategy_point_amount * greatBuilding.arcBonus)),
              blueprints: ranking.reward.blueprints,
              blueprintsBonus: Math.round(fixFloat(ranking.reward.blueprints * greatBuilding.arcBonus)),
              medals: ranking.reward.resources.medals,
              medalsBonus: Math.round(fixFloat(ranking.reward.resources.medals * greatBuilding.arcBonus))
            }
          })
          continue
        }

        let profit = Math.round(fixFloat((ranking.reward.strategy_point_amount || 0) * (1 + greatBuilding.arcBonus) - bestSpotFP))

        // Used for both Boost and GB information
        fpAnalysis.push({
          spotSafe: bestSpotFP,
          profit: profit,
          reward: {
            fp: ranking.reward.strategy_point_amount,
            fpBonus: Math.round(fixFloat(ranking.reward.strategy_point_amount * greatBuilding.arcBonus)),
            blueprints: ranking.reward.blueprints,
            blueprintsBonus: Math.round(fixFloat(ranking.reward.blueprints * greatBuilding.arcBonus)),
            medals: ranking.reward.resources.medals,
            medalsBonus: Math.round(fixFloat(ranking.reward.resources.medals * greatBuilding.arcBonus))
          }
        })
      }
    } else {
      // Just copy rewards for Boost information
      for (let i = 0; i < rankings.length; i++) {
        let ranking = rankings[i]
        if (ranking.player.player_id === greatBuilding.ownerId) {
          // Skip owner (doesn't have reward)
          continue
        }

        if (ranking.reward === undefined) {
          // Nothing to store
          continue
        }

        fpAnalysis.push({
          reward: {
            fp: ranking.reward.strategy_point_amount,
            fpBonus: Math.round(fixFloat(ranking.reward.strategy_point_amount * greatBuilding.arcBonus)),
            blueprints: ranking.reward.blueprints,
            blueprintsBonus: Math.round(fixFloat(ranking.reward.blueprints * greatBuilding.arcBonus)),
            medals: ranking.reward.resources.medals,
            medalsBonus: Math.round(fixFloat(ranking.reward.resources.medals * greatBuilding.arcBonus))
          }
        })
      }
    }

    // Add investments for all (original) rankings
    let ranking = 0
    for (let i = 0; i < dataRankings.length; i++) {
      if (dataRankings[i].player.player_id === greatBuilding.ownerId) {
        // Don't store SP for owner (unless it is player, as the SPs are shifted after player)
        continue
      }
      if (fpAnalysis.length > ranking) {
        fpAnalysis[ranking].invested = dataRankings[i].forge_points
      } else {
        fpAnalysis.push({ invested: dataRankings[i].forge_points })
      }
      ranking++
    }
    return {
      totalFP: greatBuilding.requiredFP,
      freeFP: freeFP - selfFP,
      analysis: fpAnalysis,
      selfOwner: greatBuilding.ownerId === startup.playerId
    }
  },
  checkGBChanges: function (data, resultCallback) {
    if (data.length === 0) {
      // Nothing to do
      return resultCallback({ player: '', changes: [] })
    }
    let playerId = data[0].player.player_id
    syncGet({ 'playerGBs': {}, 'playerInfo': {} }, function (result) {
      let playerGB = (result.playerGBs[playerId]) || {}
      let playerInfo = (result.playerInfo[playerId]) || {}
      let changes = []
      let newPlayerGB = {
        lastAccess: Math.floor(Date.now() / 1000)
      }

      if (playerGB.lastAccess > newPlayerGB.lastAccess) {
        // Remove in a few releases: convert existing data from milliseconds to seconds
        playerGB.lastAccess = playerGB.lastAccess / 1000
      }

      for (let i = 0; i < data.length; i++) {
        let GBentry = playerGB[data[i].city_entity_id] || {
          // New GB, so use current values to prevent it being 'just changed'
          level: data[i].level,
          current_process: data[i].current_progress,
          lastChange: playerGB.lastAccess
        }

        let changeData = {
          name: data[i].name,
          lastChange: GBentry.lastChange,
          completePercentage: parseFloat((data[i].current_progress || 0) / data[i].max_progress * 100).toPrecision(3)
        }
        // Check for changes
        if (GBentry.level !== data[i].level || GBentry.current_progress !== data[i].current_progress) {
          // GB changed since last time
          console.log('changed', JSON.stringify(GBentry), data[i])
          changeData.lastChange = playerGB.lastAccess
          GBentry.lastChange = playerGB.lastAccess
        }
        changes.push(changeData)

        // Update entry
        GBentry.level = data[i].level
        GBentry.current_progress = data[i].current_progress
        newPlayerGB[data[i].city_entity_id] = GBentry
      }
      result.playerGBs[playerId] = newPlayerGB
      syncSet({ 'playerGBs': result.playerGBs })

      resultCallback({ player: { name: data[0].player.name, info: playerInfo }, changes: changes })
    })
  },
  storeBuildingInfo: function (requestId, ownerId, requiredFP) {
    greatBuilding.requestId = requestId
    greatBuilding.ownerId = ownerId
    greatBuilding.requiredFP = requiredFP
  },
  checkArcBonus: function (entities) {
    // Check for Arc bonus as we need it for our calculations
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].cityentity_id === 'X_FutureEra_Landmark1' && entities[i].player_id === startup.playerId) {
        if (debug) {
          console.log('Arc', entities[i])
        }
        greatBuilding.setArcBonus(entities[i].bonus.value)
      }
    }
  },
  setArcBonus: function (bonus) {
    bonus = fixFloat(bonus / 100)
    greatBuilding.arcBonus = bonus
    syncSet({ 'arcBonus': bonus })
    if (debug) {
      console.log('arc bonus: ', greatBuilding.arcBonus)
    }
  }
}

listenToWorldIDChanged(function () {
  syncGet({ 'arcBonus': 0 }, function (result) {
    greatBuilding.arcBonus = parseFloat(result.arcBonus)
    if (debug) {
      console.log('arc bonus: ', greatBuilding.arcBonus)
    }
  })
})

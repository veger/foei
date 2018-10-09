greatBuilding = {
  requestId: -1,
  requiredFP: 0,
  arcBonus: 0,
  process: function (method, data, id) {
    if (trace) {
      console.log(method, data);
    }
    switch (method) {
      case 'getConstruction':
        if (greatBuilding.requestId != id) {
          console.error('Wrong id ' + id + ', expected ' + greatBuilding.requestId);
          return;
        }

        investedFP = 0;
        userFP = 0;
        userIndex = -1;
        for (var i = 0; i < data.rankings.length; i++) {
          ranking = data.rankings[i];
          if (ranking.forge_points) {
            investedFP += ranking.forge_points;
            if (ranking.player.is_self) {
              userIndex = i;
              userFP = ranking.forge_points;
            }
          }
        }
        freeFP = (greatBuilding.requiredFP - investedFP);

        if (debug) {
          console.log('free SP: ' + freeFP + ' (' + (freeFP / 2) + ')');
          console.log('user (#' + (userIndex + 1) + '): ' + userFP);
        }

        var fpAnalysis = [];
        var rank = 0;
        var i = -1;
        while (rank <= 5 && i < data.rankings.length - 1) {
          i++;
          ranking = data.rankings[i];
          if (ranking.reward === undefined) {
            // Probably (hopefully) owner
            continue;
          }
          rank = ranking.rank;

          var investedByOthers = 0;
          var bestSpotFP = greatBuilding.requiredFP;
          var rankj = 0;
          var j = i + 1;
          while (rankj <= 5 && j >= 1) {
            j--;
            if (data.rankings[j].reward === undefined) {
              // Probably (hopefully) owner
              continue;
            }
            rankj = data.rankings[j].rank;

            // TODO Doesn't work properly with userFP != 0
            investedByOthers += (data.rankings[j].forge_points || 0);
            tmp = Math.ceil((freeFP + investedByOthers + j - i) / (i - j + 2));
            if (tmp <= data.rankings[j].forge_points) {
              tmp = data.rankings[j].forge_points + 1;
            }
            if (tmp < bestSpotFP) {
              bestSpotFP = tmp;
            }
          }

          if (bestSpotFP > freeFP) {
            fpAnalysis.push(false);
            continue;
          }

          profit = Math.round(fixFloat((ranking.reward.strategy_point_amount || 0) * (1 + greatBuilding.arcBonus) - bestSpotFP));

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
          });
        }

        if (debug) {
          console.log(fpAnalysis);
        }

        sendMessageCache({gbFpAnalysis: fpAnalysis});
        break;
      default:
        if (trace || debug) {
          console.log(method + ' is not used');
        }
    }
  },
  storeBuildingInfo: function (requestId, requiredFP) {
    greatBuilding.requestId = requestId;
    greatBuilding.requiredFP = requiredFP;
  },
  setArcBonus: function (bonus) {
    bonus = fixFloat(bonus / 100);
    greatBuilding.arcBonus = bonus;
    chrome.storage.sync.set({'arcBonus': bonus});
  }
};

chrome.storage.sync.get({'arcBonus': 0}, function (result) {
  greatBuilding.arcBonus = parseFloat(result.arcBonus);
  console.log(greatBuilding.arcBonus);
});

greatBuilding = {
  requestId: -1,
  requiredFP: 0,
  process: function (method, data, id) {
    if (trace) {
      console.log(data);
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

        console.log('investedFP: ' + investedFP, 'user (#' + (userIndex + 1) + '): ' + userFP);

        var investAdvice = -1;
        // TODO Calculate profit for all rankings (with `reward`)
        // TODO Calculate risk
        // TODO * safe profit on current ranks
        // TODO * still safe profit when dropping ranks?
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
  }
};

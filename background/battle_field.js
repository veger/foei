battleField = {
  lastPlayerAttacked: -1,
  process: function (method, data, id) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'startPvP':
        armies = battleField.getArmies(data.state.unitsOrder);
        bonuses = battleField.getBonuses(data.state.unitsOrder[0].bonuses);

        battleField.storeBattleDetails(data.defenderPlayerId, armies[1], armies[3], bonuses.join('/'));

        if (debug) {
          console.log('attacker', armies[1]);
          console.log('defender', armies[2]);

          summary = [];
          for (var [unitType, amount] of Object.entries(armies[3])) {
            summary.push((amount > 1 ? amount + ' ' : '') + unitType);
          }

          console.log('summary', summary.join(', ') + (bonuses.length > 0 ? ' (' + bonuses.join('/') + ')' : ''));
        }
        break;
      case 'submitMove':
        if (data.ranking_data) {
          battleWon = data.ranking_data.winner == 1;

          var lostHP = 0;
          for (var i = 0; i < data.unitsOrder.length; i++) {
            unitInfo = data.unitsOrder[i];
            if (unitInfo.teamFlag == 1) {
              lostHP += unitInfo.startHitpoints - unitInfo.currentHitpoints;
            }
          }
          if (debug) {
            console.log('Battle ' + (battleWon ? 'won' : 'lost') + ' lost HP: ' + lostHP);
          }
          battleField.storeBattleResults(battleWon, lostHP);
        }
        break;
      default:
        if (trace || debug) {
          console.log(method + ' is not used');
        }
    }
  },

  getArmies: function (armiesData) {
    armies = {
      1: {},
      2: {}
    };
    for (var i = 0; i < armiesData.length; i++) {
      unit = armiesData[i];
      armies[unit.teamFlag][unit.unitTypeId] = (armies[unit.teamFlag][unit.unitTypeId] | 0) + 1;
    }

    summary = {};
    for (var [unitId, amount] of Object.entries(armies[2])) {
      unitInfo = consts.units[unitId];
      if (unitInfo === undefined) {
        console.error('unknown type: ' + unitId);
      } else {
        summary[unitInfo.type] = (summary[unitInfo.type] | 0) + amount;
      }
    }
    armies[3] = summary;

    return armies;
  },

  getBonuses: function (bonuses) {
    bonusesMap = {};
    for (var i = 0; i < bonuses.length; i++) {
      if (bonuses[i].value) {
        type = bonuses[i].type;
        bonusesMap[type] = (bonusesMap[type] | 0) + bonuses[i].value;
      }
    }
    atkDef = [];
    def = Math.floor(bonusesMap.defense_boost / 30);
    if (def > 0) {
      atkDef.push((def == 1 ? '' : def) + 'def');
    }
    atk = Math.floor(bonusesMap.attack_boost / 30);
    if (atk > 0) {
      atkDef.push((atk == 1 ? '' : atk) + 'atk');
    }

    return atkDef;
  },

  storeBattleDetails: function (playerId, attackUnits, defendUnits, defendBonus) {
    battleField.lastPlayerAttacked = playerId;

    chrome.storage.sync.get({'playerArmies': {}}, function (result) {
      playerArmies = result.playerArmies;
      var armyDetails = playerArmies[playerId] || {};

      if (armyDetails.battles == undefined || !mapEqual(armyDetails.defendUnits, defendUnits)) {
        // (re)set details of previous battles
        armyDetails.battles = {wins: 0, loses: 0, details: []};

        armyDetails.defendUnits = defendUnits;
      }
      armyDetails.defendBonus = defendBonus;

      armyDetails.battles.details.push({attackUnits: attackUnits});

      armyDetails.lastAccess = Date.now();
      playerArmies[playerId] = armyDetails;
      chrome.storage.sync.set({'playerArmies': playerArmies});
    });
  },

  storeBattleResults: function (battleWon, lostHP) {
    chrome.storage.sync.get({'playerArmies': {}}, function (result) {
      playerArmies = result.playerArmies;
      var armyDetails = playerArmies[battleField.lastPlayerAttacked] || {};

      armyDetails.battles.details[armyDetails.battles.details.length - 1].lostHp = lostHP;
      armyDetails.battles.details[armyDetails.battles.details.length - 1].won = battleWon;
      armyDetails.battles[battleWon ? 'wins' : 'loses']++;

      armyDetails.lastAccess = Date.now();
      playerArmies[battleField.lastPlayerAttacked] = armyDetails;
      chrome.storage.sync.set({'playerArmies': playerArmies});

      battleField.lastPlayerAttacked = -1;
    });
  }
};

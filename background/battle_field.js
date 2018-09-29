battleField = {
  process: function (method, data, id) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'startPvP':
        armies = battleField.getArmies(data.state.unitsOrder);
        console.log('attacker', armies[1]);
        console.log('defender', armies[2]);
        summary = [];
        for (var [unitType, amount] of Object.entries(armies[3])) {
          summary.push((amount > 1 ? amount + ' ' : '') + unitType);
        }
        bonuses = battleField.getBonuses(data.state.unitsOrder[0].bonuses);
        console.log('summary', summary.join(', ') + (bonuses.length > 0 ? ' (' + bonuses.join('/') + ')' : ''));
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
  }
};

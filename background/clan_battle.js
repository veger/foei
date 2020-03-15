const clanBattle = {
  process: function (method, data, id) {
    if (trace) {
      console.log('ClanBattleService.' + method, data)
    }
    switch (method) {
      case 'getProvinceSectorDetailed': {
        const armies = clanBattle.getArmies(data.defending_armies)
        sendMessageCache({ clanArmies: armies })
        break
      }
      default:
        if (trace || debug) {
          console.log('ClanBattleService.' + method + ' is not used')
        }
    }
  },

  getArmies: function (data) {
    const armies = []
    for (const army of Object.values(data)) {
      const armyData = {}
      for (const unit of Object.values(army.units)) {
        armyData[unit.unitTypeId] = (armyData[unit.unitTypeId] || 0) + 1
      }
      armies.push({ units: armyData, hp: army.hitpoints })
    }
    return armies
  }
}

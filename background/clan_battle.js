const clanBattle = {
  process: function (method, data, id) {
    if (trace) {
      console.log('ClanBattleService.' + method, data)
    }
    switch (method) {
      case 'getProvinceSectorDetailed':
        const armies = clanBattle.getArmies(data.defending_armies)
        console.log(armies)
        sendMessageCache({ clanArmies: armies })
        break
      default:
        if (trace || debug) {
          console.log('ClanBattleService.' + method + ' is not used')
        }
    }
  },

  getArmies: function (data) {
    let armies = []
    for (let army of Object.values(data)) {
      let armyData = {}
      for (let unit of Object.values(army.units)) {
        armyData[unit.unitTypeId] = (armyData[unit.unitTypeId] || 0) + 1
      }
      armies.push({ units: armyData, hp: army.hitpoints })
    }
    return armies
  }
}

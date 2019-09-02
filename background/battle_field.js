'use strict'

const battleField = {
  lastPlayerAttacked: -1,
  process: function (method, data, id) {
    if (trace) {
      console.log('BattlefieldService.' + method, data)
    }
    switch (method) {
      case 'autoFinish': // old/depreciated message
        battleField.processStartBattle(data, function () {
          battleField.processBattleMove(data.state, true)
        })
        break
      case 'startPvP': // old/depreciated message
      case 'startByBattleType':
      case 'continueBattle':
        battleField.processStartBattle(data, function () {
          if (data.isAutoBattle) {
            // Battle finished immediately
            battleField.processBattleMove(data.state, true)
          }
        })
        break
      case 'submitMove':
      case 'surrender':
        battleField.processBattleMove(data)
        break
      default:
        if (trace || debug) {
          console.log('BattlefieldService.' + method + ' is not used')
        }
    }
  },

  processStartBattle: function (data, callback) {
    if (data.battleType.type !== 'pvp') {
      // We only care about attacking neighbours
      return
    }

    let armies = battleField.getArmies(data.state.unitsOrder)

    let enemyUnit = 0
    for (; enemyUnit < data.state.unitsOrder.length; enemyUnit++) {
      if (data.state.unitsOrder[enemyUnit].teamFlag === 2) {
        // Found an enemy
        break
      }
    }
    let bonuses = battleField.getBonuses(data.state.unitsOrder[enemyUnit].bonuses)

    battleField.storeBattleDetails(data.defenderPlayerId, armies[1], armies[3], bonuses.join(' / '), callback)

    if (debug) {
      console.log('attacker', armies[1])
      console.log('defender', armies[2])

      let summary = []
      for (let [unitType, amount] of Object.entries(armies[3])) {
        summary.push((amount > 1 ? amount + ' ' : '') + unitType)
      }

      console.log('summary', summary.join(', ') + (bonuses.length > 0 ? ' (' + bonuses.join(' / ') + ')' : ''))
    }
  },

  processBattleMove: function (data, isAutoBattle) {
    if (battleField.lastPlayerAttacked < 0) {
      // Unknown player (Expedition, other non-pvp battle, or error), no need to update battle statistics
      return
    }
    if (!data.surrenderBit && !data.winnerBit) {
      // Battle is not finished yet
      return
    }

    let battleWon = data.ranking_data.winner === 1
    let unitsDied = {}

    let lostHP = 0
    for (let i = 0; i < data.unitsOrder.length; i++) {
      let unitInfo = data.unitsOrder[i]
      if (unitInfo.teamFlag === 1) {
        if (unitInfo.currentHitpoints === undefined || unitInfo.currentHitpoints === 0) {
          // Unit died
          lostHP += unitInfo.startHitpoints
          unitsDied[unitInfo.unitTypeId] = (unitsDied[unitInfo.unitTypeId] | 0) + 1
        } else {
          lostHP += unitInfo.startHitpoints - unitInfo.currentHitpoints
        }
      }
    }
    if (debug) {
      console.log('Battle ' + (battleWon ? 'won' : 'lost') + ', lost HP: ' + lostHP + ' died: ', unitsDied)
    }
    battleField.storeBattleResults(battleWon, data.surrenderBit === 1, lostHP, unitsDied, isAutoBattle === true)
  },

  getArmies: function (armiesData) {
    let armies = {
      1: {},
      2: {}
    }
    for (let i = 0; i < armiesData.length; i++) {
      let unit = armiesData[i]
      armies[unit.teamFlag][unit.unitTypeId] = (armies[unit.teamFlag][unit.unitTypeId] | 0) + 1
    }

    let summary = {}
    let unknownTypes = []
    for (let [unitId, amount] of Object.entries(armies[2])) {
      let unitInfo = consts.units[unitId]
      if (unitInfo === undefined) {
        if (!unknownTypes.includes(unitId)) {
          unknownTypes.push(unitId)
        }
      } else {
        summary[unitInfo.type] = (summary[unitInfo.type] | 0) + amount
      }
    }
    armies[3] = summary

    if (unknownTypes.length === 0) {
      sendNotification('unitUnknown', '', '')
    } else {
      sendNotification('unitUnknown', 'warning', 'unknown type(s): ' + unknownTypes.join(', '))
    }

    return armies
  },

  getBonuses: function (bonuses) {
    let bonusesMap = {}
    for (let i = 0; i < bonuses.length; i++) {
      if (bonuses[i].value) {
        let type = bonuses[i].type
        bonusesMap[type] = (bonusesMap[type] | 0) + bonuses[i].value
      }
    }
    let atkDef = []
    let def = (bonusesMap.defense_boost | 0) + (bonusesMap.fierce_resistance | 0) + (bonusesMap.advanced_tactics | 0)
    if (def > 0) {
      atkDef.push(`${def}% def`)
    }
    let atk = (bonusesMap.attack_boost | 0) + (bonusesMap.fierce_resistance | 0) + (bonusesMap.advanced_tactics | 0)
    console.log('bonusesMap', bonusesMap, def, atk)
    if (atk > 0) {
      atkDef.push(`${atk}% atk`)
    }

    return atkDef
  },

  storeBattleDetails: function (playerId, attackUnits, defendUnits, defendBonus, callback) {
    battleField.lastPlayerAttacked = playerId

    syncGet({ 'playerArmies': {} }, function (result) {
      let playerArmies = result.playerArmies
      let armyDetails = playerArmies[playerId] || {}

      if (armyDetails.battles === undefined || !mapEqual(armyDetails.defendUnits, defendUnits)) {
        // (re)set details of previous battles
        armyDetails.battles = { wins: 0, loses: 0, details: [] }

        armyDetails.defendUnits = defendUnits
      }
      armyDetails.defendBonus = defendBonus

      armyDetails.battles.details.push({ attackUnits: attackUnits })

      armyDetails.lastAccess = Date.now()
      playerArmies[playerId] = armyDetails
      syncSet({ 'playerArmies': playerArmies }, callback)

      sendPlayerArmies(playerId)
    })
  },

  storeBattleResults: function (battleWon, surrendered, lostHP, unitsDied, isAutoBattle) {
    syncGet({ 'playerArmies': {} }, function (result) {
      let playerArmies = result.playerArmies
      let armyDetails = playerArmies[battleField.lastPlayerAttacked] || {}

      let details = armyDetails.battles.details[armyDetails.battles.details.length - 1]
      details.lostHp = lostHP
      if (Object.keys(unitsDied).length > 0) {
        details.unitsDied = unitsDied
      }
      details.won = battleWon
      details.lost = !battleWon
      details.surrendered = surrendered
      details.isAutoBattle = isAutoBattle
      armyDetails.battles.details[armyDetails.battles.details.length - 1] = details

      armyDetails.battles[battleWon ? 'wins' : 'loses']++

      armyDetails.lastAccess = Date.now()
      playerArmies[battleField.lastPlayerAttacked] = armyDetails
      syncSet({ 'playerArmies': playerArmies })

      sendPlayerArmies(battleField.lastPlayerAttacked)

      battleField.lastPlayerAttacked = -1
    })
  }
}

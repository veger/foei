'use strict'

function updateBattleStats (battleStats) {
  const unitData = getStaticData('unit_types')
  let battleStatsHTML = ''

  if (battleStats.defendUnits) {
    const defendArmies = []
    for (const [unitID, amount] of Object.entries(battleStats.defendUnits)) {
      if (unitData[unitID]) {
        const unitName = unitData[unitID].name
        for (let i = 0; i < amount; i++) {
          defendArmies.push(renderUnit(unitID, unitName))
        }
      } else {
        // TODO Remove after (some) release(s), it is a hack to correctly show the 'old' units
        defendArmies.push((amount > 1 ? amount + ' ' : '') + unitID + ', ')
      }
    }

    battleStatsHTML += '<div class="row"><div class="col-2">Units:</div><div class="col-10">' + defendArmies.join('')
    if (battleStats.defendBonus) {
      battleStatsHTML += ' (' + battleStats.defendBonus + ')'
    }
    battleStatsHTML += '</div></div>'
  }

  if (battleStats.battles) {
    battleStatsHTML += '<div class="row"><div class="col-2">Results:</div><div class="col-10">' + battleStats.battles.wins + ' <span style="color: green;">wins</span> / ' + battleStats.battles.loses + ' <span style="color: red;">loses</span>'
    battleStatsHTML += '</div></div>'

    if (battleStats.battles.details.length > 0) {
      const lastBattle = battleStats.battles.details[battleStats.battles.details.length - 1]
      battleStatsHTML += battleReport(lastBattle, true)

      if (battleStats.battles.details.length > 1) {
        battleStatsHTML += '<div class="row"><div class="col-2"></div><div class="col-10"><button id ="show-all-battles" class="btn btn-link" type="button" data-toggle="collapse" data-target="#all-battles" aria-expanded="false" aria-controls="all-battles">previous battles</button>'
        battleStatsHTML += '<div class="collapse" id="all-battles">'

        for (let i = battleStats.battles.details.length - 2; i >= 0; i--) {
          battleStatsHTML += battleReport(battleStats.battles.details[i], false)
        }
        battleStatsHTML += '</div></div></div>'
      }
    }
  }

  if (battleStatsHTML) {
    battleStatsHTML = '<div><button type="button" class="close" data-dismiss="alert" data-target="#army-info div" aria-label="Close"><span aria-hidden="true">×</span></button>' + battleStatsHTML + '</div>'
  }

  $('#army-info').html(battleStatsHTML)
}

function battleReport (battle, showLabel) {
  const attackUnits = listUnits(battle.attackUnits)
  let reportHTML = '<div class="row">'
  if (showLabel) {
    reportHTML += '<div class="col-2">Last battle:</div>'
  }
  reportHTML += '<div class="col-' + (showLabel ? 10 : 12) + '">'
  if (!battle.won && !battle.lost) {
    reportHTML += '<span>active'
  } else if (battle.won) {
    reportHTML += '<span style="color: green;">won'
  } else {
    reportHTML += '<span style="color: red;">'
    if (battle.surrendered) {
      reportHTML += 'surrendered'
    } else {
      reportHTML += 'lost'
    }
  }
  reportHTML += '</span>' + (battle.isAutoBattle ? ' (auto):  ' : ': ') + attackUnits.join('')

  if (battle.lostHp) {
    reportHTML += ' (HP lost: ' + battle.lostHp
    if (battle.unitsDied !== undefined) {
      const unitsDied = listUnits(battle.unitsDied)
      reportHTML += ', dead: ' + unitsDied.join('')
    }
    reportHTML += ')'
  }
  reportHTML += '</div></div>'
  return reportHTML
}

function listUnits (unitMap) {
  const unitData = getStaticData('unit_types')
  const units = []
  Object.keys(unitMap).sort().forEach((unitID) => {
    const unitName = (unitData[unitID] || { name: unitID }).name
    const amount = unitMap[unitID]
    for (let i = 0; i < amount; i++) {
      units.push(renderUnit(unitID, unitName))
    }
  })

  return units
}

function renderUnit (unitID, unitName) {
  return `<img srcset="https://foeen.innogamescdn.com/assets/shared/unit_portraits/armyuniticons_90x90/armyuniticons_90x90_${unitID}.jpg 100w" sizes="75px" src="https://foeen.innogamescdn.com/assets/shared/unit_portraits/armyuniticons_90x90/armyuniticons_90x90_${unitID}.jpg" class="unit-portrait thumbnail" data-toggle="tooltip" data-placement="top" title="${unitName}"/>`
}

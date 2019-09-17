'use strict'

function updateBattleStats (battleStats) {
  const unitData = getStaticData('unit_types')
  let battleStatsHTML = ''

  if (battleStats.defendUnits) {
    let defendArmies = []
    for (let [unitID, amount] of Object.entries(battleStats.defendUnits)) {
      defendArmies.push((amount > 1 ? amount + ' ' : '') + (unitData[unitID] || { name: unitID }).name)
    }

    battleStatsHTML += '<div class="row"><div class="col-2">Units:</div><div class="col-10">' + defendArmies.join(', ')
    if (battleStats.defendBonus) {
      battleStatsHTML += ' (' + battleStats.defendBonus + ')'
    }
    battleStatsHTML += '</div></div>'
  }

  if (battleStats.battles) {
    battleStatsHTML += '<div class="row"><div class="col-2">Results:</div><div class="col-10">' + battleStats.battles.wins + ' <span style="color: green;">wins</span> / ' + battleStats.battles.loses + ' <span style="color: red;">loses</span>'
    battleStatsHTML += '</div></div>'

    if (battleStats.battles.details.length > 0) {
      let lastBattle = battleStats.battles.details[battleStats.battles.details.length - 1]
      battleStatsHTML += battleReport(lastBattle, true)

      if (battleStats.battles.details.length > 1) {
        battleStatsHTML += '<div class="row"><div class="col-2"></div><div class="col-10"><button class="btn btn-info btn-sm" type="button" data-toggle="collapse" data-target="#all-battles" aria-expanded="false" aria-controls="all-battles">previous battles</button>'
        battleStatsHTML += '<div class="collapse" id="all-battles">'

        for (let i = battleStats.battles.details.length - 2; i >= 0; i--) {
          battleStatsHTML += battleReport(battleStats.battles.details[i], false)
        }
        battleStatsHTML += '</div></div></div>'
      }
    }
  }

  $('#army-info').html(battleStatsHTML)
}

function battleReport (battle, showLabel) {
  let attackUnits = listUnits(battle.attackUnits)
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
      let unitsDied = listUnits(battle.unitsDied)
      reportHTML += ', <span style="color: red;">' + unitsDied.join('') + '</span> died'
    }
    reportHTML += ')'
  }
  reportHTML += '</div></div>'
  // https://foeen.innogamescdn.com/assets/shared/unit_portraits/armyuniticons_50x50/armyuniticons_50x50_hoplite.jpg
  return reportHTML
}

function listUnits (unitMap) {
  const unitData = getStaticData('unit_types')
  console.log(unitData)
  let units = []
  Object.keys(unitMap).sort().forEach((unitID) => {
    console.log(unitID, (unitData[unitID] || { name: unitID }).name)
    const unitName = (unitData[unitID] || { name: unitID }).name
    const amount = unitMap[unitID]
    units.push((amount > 1 ? amount + ' ' : '') + renderUnit(unitID, unitName))
  })

  return units
}

function renderUnit (unitID, unitName) {
  return `<img srcset="https://foeen.innogamescdn.com/assets/shared/unit_portraits/armyuniticons_50x50/armyuniticons_50x50_${unitID}.jpg 100w" sizes="75px" src="https://foeen.innogamescdn.com/assets/shared/unit_portraits/armyuniticons_50x50/armyuniticons_50x50_${unitID}.jpg" class="unit-portrait" data-toggle="tooltip" data-placement="top" title="${unitName}"/>`
}

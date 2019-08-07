'use strict'

function updateBattleStats (battleStats) {
  let battleStatsHTML = ''

  if (battleStats.defendUnits) {
    let defendArmies = []
    for (let [unitType, amount] of Object.entries(battleStats.defendUnits)) {
      defendArmies.push((amount > 1 ? amount + ' ' : '') + unitType)
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
  reportHTML += '</span>' + (battle.isAutoBattle ? ' (auto):  ' : ': ') + attackUnits.join(', ')

  if (battle.lostHp) {
    reportHTML += ' (HP lost: ' + battle.lostHp
    if (battle.unitsDied !== undefined) {
      let unitsDied = listUnits(battle.unitsDied)
      reportHTML += ', <span style="color: red;">' + unitsDied.join(', ') + '</span> died'
    }
    reportHTML += ')'
  }
  reportHTML += '</div></div>'

  return reportHTML
}

function listUnits (unitMap) {
  let units = []
  Object.keys(unitMap).sort().forEach((unitType) => {
    const amount = unitMap[unitType]
    units.push((amount > 1 ? amount + ' ' : '') + unitType)
  })

  return units
}

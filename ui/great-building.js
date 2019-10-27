'use strict'

function updateGreatBuildingAnalysis (fpAnalysis, selfOwner) {
  let ggRows = ''
  if (selfOwner) {
    ggRows = '<tr><td colspan="6">No investment advice available for own buildings</td></tr>'
  } else {
    let hasAdvice = false
    for (let i = 0; i < fpAnalysis.length; i++) {
      let analysis = fpAnalysis[i]
      if (analysis.spotSafe !== undefined && analysis.spotSafe !== false) {
        ggRows += addGreatBuildingAnalysisRow(i + 1, fpAnalysis[i])
        hasAdvice = true
      }
    }
    if (!hasAdvice) {
      ggRows = '<tr><td colspan="6">No advice available</td></tr>'
    }
  }
  $('#great-building-body').html(ggRows)
}

function updateGreatBuildingBoostInfo (fpAnalysis) {
  let boostFactor = $('#boost-factor').val()
  let ggRows = ''
  let boostRush = ''
  let prevBoostInvestment = 0

  // Calculate totalFP using the free + investments (that matter), in order to ignore the investments that do not influence (self, not enough for boost, rank without reward)
  let totalFP = fpAnalysis.freeFP
  let prevRanked = true
  for (let i = 0; i < fpAnalysis.analysis.length; i++) {
    const reward = (fpAnalysis.analysis[i].reward || { fp: 0 })
    const required = Math.ceil(reward.fp * boostFactor)
    const invested = (fpAnalysis.analysis[i].invested || 0)
    if (prevRanked && invested >= required) {
      totalFP += invested
    }
    prevRanked = fpAnalysis.analysis[i].reward !== undefined
  }

  for (let i = 0; i < fpAnalysis.analysis.length; i++) {
    const analysis = fpAnalysis.analysis[i]
    if (analysis.reward !== undefined) {
      const reward = analysis.reward
      const required = Math.ceil(reward.fp * boostFactor)
      const nextInvestment = (i + 1 < fpAnalysis.analysis.length) ? fpAnalysis.analysis[i + 1].invested || 0 : 0

      let fillForSafeBoost = -1
      if (analysis.invested === undefined || analysis.invested < required) {
        fillForSafeBoost = totalFP - prevBoostInvestment - required * 2
      }
      let fillForSafeCurrent = ''
      if (analysis.invested) {
        fillForSafeCurrent = fpAnalysis.freeFP - analysis.invested + nextInvestment
      }

      const notInvestedEnough = analysis.invested > 0 && analysis.invested < required

      ggRows += addGreatBuildingBoostRow(i + 1, boostFactor, fpAnalysis.analysis[i], notInvestedEnough, fillForSafeBoost, fillForSafeCurrent)
      const invested = (analysis.invested || 0)
      if (invested >= required) {
        prevBoostInvestment += invested
      }
      if (reward.fp !== undefined) {
        boostRush += 'p' + (i + 1) + ' ' + required + ', '
      }
    }
  }

  $('#great-building-boost-body').html(ggRows)
  $('#boost-rush').text(boostRush.slice(0, -2))
}

function updateGreatBuildingChanges (changes) {
  $('#great-building-changes-player').text(changes.player.name)

  let playerInfoHTML
  if (changes.player.info === undefined || changes.player.info.lastUpdate === undefined) {
    playerInfoHTML = '<span style="color:orange;">no info</span>'
  } else {
    playerInfoHTML = (changes.player.info.active ? 'active' : '<span style="color:red;">inactive</span>')
    playerInfoHTML += ' <span style="font-size:8pt">updated ' + moment.unix(changes.player.info.lastUpdate).fromNow(false) + '</span>'
  }
  $('#great-building-changes-player-info').html(playerInfoHTML)

  changes = changes.changes
  let ggRows = ''
  if (changes.length === 0) {
    ggRows = '<tr><td colspan="3">No buildings</td></tr>'
  } else {
    for (let i = 0; i < changes.length; i++) {
      ggRows += addGreatBuildingChangesRow(changes[i])
    }
  }

  $('#great-building-changes-body').html(ggRows)
}

function addGreatBuildingAnalysisRow (spot, analysis) {
  let row = '<tr><td>' + spot + '</td><td>' + iconImage('strategy_points') + ' ' + analysis.spotSafe + (analysis.spotSafe <= 0 ? ' (safe)' : '') + '</td><td' + (analysis.spotSafe >= 0 ? (analysis.profit < 0 ? ' style="color:red;"' : '') + '>' + iconImage('strategy_points') + ' ' + analysis.profit : '>') + '</td>'
  row += '<td>'
  if (analysis.reward.blueprints) {
    row += iconImage('blueprint') + ' ' + analysis.reward.blueprints
  }
  row += '</td><td>'
  if (analysis.reward.blueprintsBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.blueprintsBonus
  }
  row += '</td><td>'
  if (analysis.reward.medals) {
    row += iconImage('medals') + ' ' + analysis.reward.medals
  }
  row += '</td><td>'
  if (analysis.reward.medalsBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.medalsBonus
  }
  row += '</td><td>'
  if (analysis.reward.fp) {
    row += iconImage('strategy_points') + ' ' + analysis.reward.fp
  }
  row += '</td><td>'
  if (analysis.reward.fpBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.fpBonus
  }
  row += '</td>'

  return row
}

function renderRequiredPositive (value) {
  if (value <= 0) {
    return '<i class="text-success fas fa-check"></i>'
  }

  return `${iconImage('strategy_points')} ${value}`
}

function addGreatBuildingBoostRow (spot, boostFactor, analysis, notInvestedEnough, fillForSafeBoost, fillForSafeCurrent) {
  if (analysis.reward.fp === undefined) {
    return ''
  }

  let required = Math.ceil(analysis.reward.fp * boostFactor)

  let row = `<tr ${notInvestedEnough ? ' class="table-warning"' : ''}>`
  row += `<td>${spot}</td>`
  row += `<td>${iconImage('strategy_points')} ${required}${notInvestedEnough ? ` (${analysis.invested})` : ''}</td>`
  row += `<td>${renderRequiredPositive(fillForSafeBoost)}</td>`
  if (fillForSafeCurrent !== '') {
    row += `<td>${renderRequiredPositive(fillForSafeCurrent)}</td>`
  } else {
    row += '<td></td>'
  }
  row += '<td>'
  if (analysis.reward.blueprints) {
    row += iconImage('blueprint') + ' ' + analysis.reward.blueprints
  }
  row += '</td><td>'
  if (analysis.reward.blueprints) {
    row += '+ ' + iconImage('bonus') + ' ' + Math.round(analysis.reward.blueprints * (boostFactor - 1))
  }
  row += '</td><td>'
  if (analysis.reward.medals) {
    row += iconImage('medals') + ' ' + analysis.reward.medals
  }
  row += '</td><td>'
  if (analysis.reward.medals) {
    row += '+ ' + iconImage('bonus') + ' ' + Math.round(analysis.reward.medals * (boostFactor - 1))
  }
  row += '</td>'
  return row
}

function addGreatBuildingChangesRow (change) {
  return '<tr><td>' + change.name + '</td><td>' + (change.lastChange !== undefined ? moment.unix(change.lastChange).fromNow(true) : '<em>???</em>') + '</td><td>' + change.completePercentage + '%</td></tr>'
}

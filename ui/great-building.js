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
  for (let i = 0; i < fpAnalysis.analysis.length; i++) {
    if (fpAnalysis.analysis[i].reward !== undefined) {
      let reward = fpAnalysis.analysis[i].reward
      let required = Math.ceil(reward.fp * boostFactor)
      let nextInvestment = (i + 1 < fpAnalysis.analysis.length) ? fpAnalysis.analysis[i + 1].invested || 0 : 0
      ggRows += addGreatBuildingBoostRow(i + 1, boostFactor, fpAnalysis.analysis[i], fpAnalysis.totalFP, fpAnalysis.freeFP, nextInvestment)
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
  let row = '<tr><td>' + spot + '</td><td>' + iconImage('sp') + ' ' + analysis.spotSafe + (analysis.spotSafe <= 0 ? ' (safe)' : '') + '</td><td' + (analysis.spotSafe >= 0 ? (analysis.profit < 0 ? ' style="color:red;"' : '') + '>' + iconImage('sp') + ' ' + analysis.profit : '>') + '</td>'
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
    row += iconImage('medal') + ' ' + analysis.reward.medals
  }
  row += '</td><td>'
  if (analysis.reward.medalsBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.medalsBonus
  }
  row += '</td><td>'
  if (analysis.reward.fp) {
    row += iconImage('sp') + ' ' + analysis.reward.fp
  }
  row += '</td><td>'
  if (analysis.reward.fpBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.fpBonus
  }
  row += '</td>'

  return row
}

function addGreatBuildingBoostRow (spot, boostFactor, analysis, totalFP, freeFP, nextInvestment) {
  if (analysis.reward.fp === undefined) {
    return ''
  }

  let required = Math.ceil(analysis.reward.fp * boostFactor)
  let fillForSafe = totalFP - required * 2
  let requiredToMakeSafe = freeFP + nextInvestment - required
  let unsafe = analysis.invested >= required && nextInvestment + freeFP > analysis.invested && requiredToMakeSafe > 0
  let notInvestedEnough = analysis.invested > 0 && analysis.invested < required

  let row = '<tr' + (unsafe ? ' class="table-danger"' : (notInvestedEnough ? ' class="table-warning"' : '')) + '>'
  row += '<td>' + spot + '</td>'
  row += '<td>' + iconImage('sp') + ' ' + required + (notInvestedEnough ? ` (${analysis.invested})` : '') + '</td><td>' + iconImage('sp') + ' ' + fillForSafe + (unsafe ? ` (${requiredToMakeSafe})` : '') + '</td>'
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
    row += iconImage('medal') + ' ' + analysis.reward.medals
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

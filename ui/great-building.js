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
  $('#great-building-changes-player').text(changes.player)
  changes = changes.changes
  let ggRows = ''
  if (changes.length === 0) {
    ggRows = '<tr><td colspan="3">No buildings</td></tr>'
  } else {
    if (changes.length === 1 && changes[0].name === 'last change') {
      ggRows = '<tr><td colspan="3">Last change ' + moment.unix(changes[0].last_spent).fromNow() + '</td></tr>'
    } else {
      for (let i = 0; i < changes.length; i++) {
        ggRows += addGreatBuildingChangesRow(changes[i])
      }
    }
  }

  $('#great-building-changes-body').html(ggRows)
}

function addGreatBuildingAnalysisRow (spot, analysis) {
  const addReward = (reward, rewardBonus, image) => {
    return reward && iconImage(image) + ' ' + (reward + rewardBonus) + ' (' + reward + ' ' +iconImage('bonus') + ' ' + rewardBonus + ')';
  };

  const hasProfit = analysis.spotSafe >= 0 && analysis.profit < 0;

  const content = [
    spot, // spot
    iconImage('sp') + ' ' + analysis.spotSafe, // required
    '<span ' + (hasProfit ? 'style="color:red;"' : '') + '>' + iconImage('sp') + ' '  + analysis.profit +
      (analysis.profit >= 0 ? ' (' + analysis.revenue + '%)</span>' : ''), // profit
    addReward(analysis.reward.fp, analysis.reward.fpBonus, 'sp'), // fp's
    addReward(analysis.reward.blueprints, analysis.reward.blueprintsBonus, 'blueprint'), // blueprints
    addReward(analysis.reward.medals, analysis.reward.medalsBonus, 'medal'), // medals
  ];

  return '<tr><td>' + content.join('</td><td>') + '</td></tr>';
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
  return '<tr><td>' + change.name + '</td><td>' + moment.unix(change.last_spent).fromNow(true) + '</td><td>' + change.completePercentage + '%</td></tr>'
}

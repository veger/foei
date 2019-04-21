
function updateGreatBuildingAnalysis(fpAnalysis) {
  var ggRows = '';
  var hasAdvice = false;
  for (var i = 0; i < fpAnalysis.length; i++) {
    var analysis = fpAnalysis[i];
    if (analysis !== false) {
      ggRows += addGreatBuildingAnalysisRow(i + 1, fpAnalysis[i]);
      hasAdvice = true;
    }
  }
  if (!hasAdvice) {
    ggRows = '<tr><td colspan="6">No advice available</td></tr>';
  }
  $('#great-building-body').html(ggRows);
}

function updateGreatBuildingBoostInfo(rewards) {
  var ggRows = '';
  for (var i = 0; i < rewards.rewards.length; i++) {
    ggRows += addGreatBuildingBoostRow(i + 1, rewards.rewards[i], rewards.totalFP);
  }

  $('#great-building-boost-body').html(ggRows);
}

function updateGreatBuildingChanges(changes) {
  $('#great-building-changes-player').text(changes.player);
  changes = changes.changes;
  ggRows = '';
  if (changes.length == 0) {
    ggRows = '<tr><td colspan="3">No buildings</td></tr>';
  } else {
    if (changes.length == 1 && changes[0].name === 'last change') {
      ggRows = '<tr><td colspan="3">Last change ' + moment.unix(changes[0].last_spent).fromNow() + '</td></tr>';
    } else {
      for (var i = 0; i < changes.length; i++) {
        ggRows += addGreatBuildingChangesRow(changes[i]);
      }
    }
  }

  $('#great-building-changes-body').html(ggRows);
}

function addGreatBuildingAnalysisRow(spot, analysis) {
  row = '<tr><td>' + spot + '</td><td>' + iconImage('sp') + ' ' + analysis.spotSafe + (analysis.spotSafe <= 0 ? ' (safe)' : '') + '</td><td' + (analysis.spotSafe >= 0 ? (analysis.profit < 0 ? ' style="color:red;"' : '') + '>' + iconImage('sp') + ' ' + analysis.profit : '>') + '</td>';
  row += '<td>';
  if (analysis.reward.blueprints) {
    row += iconImage('blueprint') + ' ' + analysis.reward.blueprints;
  }
  row += '</td><td>';
  if (analysis.reward.blueprintsBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.blueprintsBonus;
  }
  row += '</td><td>';
  if (analysis.reward.medals) {
    row += iconImage('medal') + ' ' + analysis.reward.medals;
  }
  row += '</td><td>';
  if (analysis.reward.medalsBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.medalsBonus;
  }
  row += '</td><td>';
  if (analysis.reward.fp) {
    row += iconImage('sp') + ' ' + analysis.reward.fp;
  }
  row += '</td><td>';
  if (analysis.reward.fpBonus) {
    row += '+ ' + iconImage('bonus') + ' ' + analysis.reward.fpBonus;
  }
  row += '</td>';

  return row;
}

function addGreatBuildingBoostRow(spot, reward, totalFP) {
  if (reward.fp === undefined) {
    return '';
  }

  boostFactor = $('#boost-factor').val();
  row = '<tr><td>' + spot + '</td><td>' + iconImage('sp') + ' ' + Math.ceil(reward.fp * boostFactor) + '</td><td>' + iconImage('sp') + ' ' + (totalFP - Math.ceil(reward.fp * boostFactor) * 2) + '</td>';
  row += '<td>';
  if (reward.blueprints) {
    row += iconImage('blueprint') + ' ' + reward.blueprints;
  }
  row += '</td><td>';
  if (reward.blueprints) {
    row += '+ ' + iconImage('bonus') + ' ' + Math.round(reward.blueprints * (boostFactor - 1));
  }
  row += '</td><td>';
  if (reward.medals) {
    row += iconImage('medal') + ' ' + reward.medals;
  }
  row += '</td><td>';
  if (reward.medals) {
    row += '+ ' + iconImage('bonus') + ' ' + Math.round(reward.medals * (boostFactor - 1));
  }
  row += '</td>';
  return row;
}

function addGreatBuildingChangesRow(change) {
  return '<tr><td>' + change.name + '</td><td>' + moment.unix(change.last_spent).fromNow(true) + '</td><td>' + change.completePercentage + '%</td></tr>';
}

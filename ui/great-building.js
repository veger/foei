
function updateGreatBuildingAnalysis (fpAnalysis) {
  var ggRows = '';
  var hasAdvice = false;
  for (var i = 0; i < fpAnalysis.length; i++) {
    var analysis = fpAnalysis[i];
    if (analysis !== false) {
      ggRows += addGreatBuildingRow(i + 1, fpAnalysis[i]);
      hasAdvice = true;
    }
  }
  if (!hasAdvice) {
    ggRows = '<tr><td colspan="6">No advice available</td></tr>';
  }
  $('#great-building-body').html(ggRows);
}

function updateGreatBuildingChanges (changes) {
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

function addGreatBuildingRow (spot, analysis) {
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

function addGreatBuildingChangesRow (change) {
  return '<tr><td>' + change.name + '</td><td>' + moment.unix(change.last_spent).fromNow(true) + '</td><td>' + change.completePercentage + '%</td></tr>';
}


function updatePlunder(revenue) {
  plunderRows = '';
  if (revenue.spMax.value > 0) {
    plunderRows += addPlunderRow('sp', revenue.spMax);
  }
  for (var i = 0; i < revenue.goods.length; i++) {
    plunderRows += addPlunderRow((i == 0 ? 'goods' : ''), revenue.goods[i]);
  }
  if (revenue.suppliesMax.value > 0) {
    plunderRows += addPlunderRow('supplies', revenue.suppliesMax);
  }
  if (revenue.moneyMax.value > 0) {
    plunderRows += addPlunderRow('money', revenue.moneyMax);
  }
  if (revenue.medalsMax.value > 0) {
    plunderRows += addPlunderRow('medal', revenue.medalsMax);
  }
  if (revenue.clanPowerMax.value > 0) {
    plunderRows += addPlunderRow('clan_power', revenue.clanPowerMax);
  }
  if (plunderRows == '') {
    plunderRows = '<td colspan="5">Nothing to plunder</td>';
  }
  $('#plunder-body').html(plunderRows);
}

function updatePlayerProtection(protected) {
  if (protected) {
    $('#player-protected').removeClass('d-none')
  } else {
    $('#player-protected').addClass('d-none')
  }
}

function createAllRows(all) {
  allRows = '';
  if (all.strategy_points) {
    allRows += addPlunderRow('sp', { value: all.strategy_points });
  }
  if (all.goods) {
    allRows += addPlunderRow('goods', { value: processRawGoodsPlunderData(all.goods) });
  }
  if (all.supplies) {
    allRows += addPlunderRow('supplies', { value: all.supplies });
  }
  if (all.money) {
    allRows += addPlunderRow('money', { value: all.money });
  }
  if (all.medals) {
    allRows += addPlunderRow('medal', { value: all.medals });
  }
  if (all.clanPower) {
    allRows += addPlunderRow('clan_power', { value: all.clanPower });
  }
  return allRows;
}

function addPlunderRow(resource, revenue) {
  row = '<tr><td>' + iconImage(resource) + '</td><td>' + revenue.value + '</td>' + (revenue.name ? '<td>' + l10n(revenue.name) + '</td>' : '');
  row += '<td>';
  if (revenue.all) {
    row += '<table>' + createAllRows(revenue.all) + '</table>';
  } else if (revenue.raw) {
    row += processRawGoodsPlunderData(revenue.raw);
  }
  row += '</td></tr>';
  return row;
}

function processRawGoodsPlunderData(raw) {
  list = [];
  for (var goodName in raw) {
    if (raw.hasOwnProperty(goodName)) {
      list.push((raw[goodName] == 1 ? '' : raw[goodName] + ' ') + goodName);
    }
  }
  return list.join(', ');
}

function iconImage(name) {
  if (name === undefined || !name) {
    return '';
  }
  return '<img src="icons/' + name + '.png">';
}

function l10n(key) {
  value = i18n[key];
  return value ? value : key;
}

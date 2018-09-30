chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.revenue) {
        updateRevenue(request.revenue);
      }
    }
  );

function updateRevenue (revenue) {
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
  if (revenue.clanPowerMax.value > 0) {
    plunderRows += addPlunderRow('clan_power', revenue.clanPowerMax);
  }
  if (plunderRows == '') {
    plunderRows = '<td colspan="4">Nothing to plunder</td>';
  }
  $('#plunder-body').html(plunderRows);
}

function addPlunderRow (resource, revenue) {
  row = '<tr><td>' + iconImage(resource) + '</td><td>' + revenue.value + '</td><td>' + revenue.name + '</td>';
  row += '<td>';
  if (revenue.raw) {
    list = [];
    for (var i = 0; i < revenue.raw.length; i++) {
      list.push(revenue.raw[i].value + ' ' + revenue.raw[i].good_id);
    }
    row += list.join(', ');
  }
  if (revenue.all) {
    row += revenue.all;
  }
  row += '</td></tr>';
  return row;
}

function iconImage (name) {
  if (name === undefined || !name) {
    return '';
  }
  return '<img src="icons/' + name + '.png">';
}

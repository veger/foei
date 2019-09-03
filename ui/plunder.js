'use strict'

function updatePlunder (revenue) {
  let plunderRows = ''
  if (revenue.spMax.value > 0) {
    plunderRows += addPlunderRow('sp', revenue.spMax)
  }
  for (let i = 0; i < revenue.resources.length; i++) {
    plunderRows += addPlunderRow((i === 0 ? 'goods' : ''), revenue.resources[i])
  }
  if (revenue.suppliesMax.value > 0) {
    plunderRows += addPlunderRow('supplies', revenue.suppliesMax)
  }
  if (revenue.moneyMax.value > 0) {
    plunderRows += addPlunderRow('money', revenue.moneyMax)
  }
  if (revenue.medalsMax.value > 0) {
    plunderRows += addPlunderRow('medal', revenue.medalsMax)
  }
  if (revenue.clanPowerMax.value > 0) {
    plunderRows += addPlunderRow('clan_power', revenue.clanPowerMax)
  }
  if (plunderRows === '') {
    plunderRows = '<td colspan="5">Nothing to plunder</td>'
  }
  $('#plunder-body').html(plunderRows)
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  })
}

function updatePlayerProtection (isProtected) {
  if (isProtected) {
    $('#player-protected').removeClass('d-none')
  } else {
    $('#player-protected').addClass('d-none')
  }
}

function createAllRows (all) {
  let allRows = ''
  if (all.strategy_points) {
    allRows += addPlunderRow('sp', { value: all.strategy_points })
  }
  if (all.resources) {
    allRows += addPlunderRow('goods', { value: processRawResourcesPlunderData(all.resources) })
  }
  if (all.supplies) {
    allRows += addPlunderRow('supplies', { value: all.supplies })
  }
  if (all.money) {
    allRows += addPlunderRow('money', { value: all.money })
  }
  if (all.medals) {
    allRows += addPlunderRow('medal', { value: all.medals })
  }
  if (all.clanPower) {
    allRows += addPlunderRow('clan_power', { value: all.clanPower })
  }
  return allRows
}

function addPlunderRow (resource, revenue) {
  let row = '<tr><td>' + iconImage(resource) + '</td><td>' + revenue.value + '</td>' + (revenue.name ? '<td style="width:1px; text-align: center;">' + (buildingImage(revenue.name) + '</td><td>' + l10n(revenue.name)) + '</td>' : '')
  row += '<td>'
  if (revenue.all) {
    row += '<table>' + createAllRows(revenue.all) + '</table></td><td>'
  } else if (revenue.raw) {
    row += processRawResourcesPlunderData(revenue.raw) + '</td><td>'
    if (Object.keys(revenue.raw).length === 1) {
      row += revenue.stock
    }
  } else {
    row += '</td><td>'
  }
  row += '</td></tr>'
  return row
}

function processRawResourcesPlunderData (raw) {
  let list = []
  for (let resourceName in raw) {
    if (raw.hasOwnProperty(resourceName)) {
      list.push((raw[resourceName] === 1 ? '' : raw[resourceName] + ' ') + '<img src="https://foeen.innogamescdn.com/assets/shared/icons/' + resourceName + '.png" class="plunder-raw-resource" data-toggle="tooltip" data-placement="top" title="' + l10nResource(resourceName) + '">')
    }
  }
  return list.join(' ')
}

function iconImage (name) {
  if (name === undefined || !name) {
    return ''
  }
  let l10nName
  switch (name) {
    case 'medal':
      l10nName = 'medals'
      break
    default:
      l10nName = name
  }
  return '<img src="icons/' + name + '.png" data-toggle="tooltip" data-placement="top" title="' + l10nResource(l10nName) + '">'
}

function l10n (key) {
  let value = i18n[key]
  return value || key
}

function l10nResource (key) {
  let value = resources[key]
  return (value || { name: key }).name
}

function buildingImage (buildingName) {
  var start = buildingName.substring(0, 2)
  var last = buildingName.substring(2, buildingName.length)
  return '<img class="thumbnail" src="https://foeen.innogamescdn.com/assets/city/buildings/' + start + 'SS_' + last + '.png">'
}

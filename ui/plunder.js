'use strict'

function updatePlunder (revenue) {
  let plunderRows = ''
  if (revenue.spMax.value > 0) {
    plunderRows += addPlunderRow('strategy_points', revenue.spMax)
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
    plunderRows += addPlunderRow('medals', revenue.medalsMax)
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
    allRows += addPlunderRow('strategy_points', { value: all.strategy_points })
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
    allRows += addPlunderRow('medals', { value: all.medals })
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
  const list = []
  for (const resourceName in raw) {
    if (Object.prototype.hasOwnProperty.call(raw, resourceName)) {
      list.push((raw[resourceName] === 1 ? '' : raw[resourceName] + ' ') + '<img src="https://foeen.innogamescdn.com/assets/shared/icons/' + resourceName + '.png" class="plunder-raw-resource" data-toggle="tooltip" data-placement="top" title="' + l10nResource(resourceName) + '">')
    }
  }
  return list.join(' ')
}

const icons = {
  blueprint: 'shared/icons/reward_icons/reward_icon_blueprint.png',
  bonus: 'city/gui/great_building_bonus_icons/great_building_bonus_contribution_boost.png',
  clan_power: 'city/gui/production_icons/production_icon_guild_power.png',
  goods: 'shared/icons/reward_icons/reward_icon_random_goods.png',
  medals: 'shared/icons/reward_icons/reward_icon_small_medals.png',
  money: 'shared/icons/reward_icons/reward_icon_money.png',
  strategy_points: 'shared/icons/reward_icons/reward_icon_forgepoints.png',
  supplies: 'shared/icons/reward_icons/reward_icon_supply.png'
}

function iconImage (name) {
  if (name === undefined || !name) {
    return ''
  }
  return `<img src="https://foeen.innogamescdn.com/assets/${icons[name]}" width="24" height="24" data-toggle="tooltip" data-placement="top" title="${l10nResource(name)}">`
}

function l10n (key) {
  const entities = getStaticData('city_entities')
  const entity = (entities || {})[key]
  return (entity || { name: key }).name
}

function l10nResource (key) {
  const value = resources[key]
  return (value || { name: key }).name
}

function buildingImage (buildingName) {
  var start = buildingName.substring(0, 2)
  var last = buildingName.substring(2, buildingName.length)
  return '<img class="thumbnail" src="https://foeen.innogamescdn.com/assets/city/buildings/' + start + 'SS_' + last + '.png">'
}

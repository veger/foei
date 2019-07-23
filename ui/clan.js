'use strict'

function updateClanArmies (clanArmies) {
  let clanArmiesRows = ''

  for (let i = 0; i < clanArmies.length; i++) {
    clanArmiesRows += addClanArmyRow(i + 1, clanArmies[i])
  }

  $('#clanarmies-body').html(clanArmiesRows)
}

function addClanArmyRow (index, army) {
  var unitDetails = listUnits(army.units)
  if (unitDetails.length === 0) {
    unitDetails = ['???']
  }
  let row = '<tr><td>' + index + '</td><td>' + army.hp + '</td><td>' + unitDetails.join(', ') + '</td></tr>'
  return row
}

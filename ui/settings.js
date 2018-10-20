function updateSettingsWorlds (worlds) {
  $('#worlds').html(worlds.length > 0 ? worlds.join(', ') : 'none');
}

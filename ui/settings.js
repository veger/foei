function updateSettingsWorlds (worlds) {
  for (var worldID in worlds) {
    if ($('#' + 'settings-' + worldID).length === 0) {
      bodyHTML = '<div class ="well">Using ' + (worlds[worldID] / 1024).toFixed(2) + ' kB storage (out of ' + (chrome.storage.sync.QUOTA_BYTES / 1024) + ' kB)</div>';
      addTab('settingsTabs', 'settingsTabContent', 'settings-' + worldID, worldID, bodyHTML);
    }
  }
}

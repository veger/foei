function updateSettingsWorlds (worlds) {
  for (var worldID in worlds) {
    if ($('#' + 'settings-' + worldID).length === 0) {
      bodyHTML = '<div>Using ' + (worlds[worldID] / 1024).toFixed(2) + ' kB storage (out of ' + (chrome.storage.sync.QUOTA_BYTES / 1024) + ' kB)';
      bodyHTML += ' <button class="btn btn-sm btn-danger" type="button" data-toggle="collapse" data-target="#' + worldID + '-collapse-delete" aria-expanded="false" aria-controls="' + worldID + '-collapse-delete">Delete</button>';
      bodyHTML += '</div>';
      bodyHTML += '<div class="collapse" id="' + worldID + '-collapse-delete"><button id="' + worldID + '-delete" class="btn btn-sm btn-danger">Yes delete</button></div>';

      addTab('settingsTabs', 'settingsTabContent', 'settings-' + worldID, worldID, bodyHTML);

      (function (worldID) {
        $('#' + worldID + '-delete').click(function () {
          $('#' + worldID + '-collapse-delete').collapse('hide');
          chrome.extension.sendMessage({ 'clear_cache': { worldID: 'delete' }});
        });
      })(worldID);
    }
  }
}

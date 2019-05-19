'use strict'

function updateSettingsWorlds (worlds) {
  for (let worldID in worlds) {
    let bodyHTML = '<div class="card m-1"><div class="card-body"><p class="card-title">Using ' + (worlds[worldID] / 1024).toFixed(2) + ' kB storage (out of ' + (chrome.storage.sync.QUOTA_BYTES / 1024) + ' kB)</p><p class="card-text">'
    bodyHTML += ' <button id="' + worldID + '-clean" class="btn btn-sm btn-warning" type="button">Clean</button>'
    bodyHTML += ' <button class="btn btn-sm btn-danger" type="button" data-toggle="collapse" data-target="#' + worldID + '-collapse-delete" aria-expanded="false" aria-controls="' + worldID + '-collapse-delete">Delete...</button>'
    bodyHTML += ' <button id="' + worldID + '-export" class="btn btn-sm" type="button">Export...</button> '
    bodyHTML += '<label class="btn btn-sm m-0" style="background-color: buttonface;">Import... <input id="' + worldID + '-import" type="file" style="display:none" /></label>'
    bodyHTML += '</p>'
    bodyHTML += '<div class="collapse" id="' + worldID + '-collapse-delete"><button id="' + worldID + '-delete" class="btn btn-sm btn-danger">Yes delete <strong style="color:black;">' + worldID + '</strong> data</button></div></div></div>'

    if ($('#settings-' + worldID).length === 0) {
      addTab('settingsTabs', 'settingsTabContent', 'settings-' + worldID, worldID, bodyHTML)
    } else {
      $('#settings-' + worldID).html(bodyHTML)
    }

    (function (worldID) {
      $('#' + worldID + '-clean').click(function () {
        chrome.extension.sendMessage({ 'cache': { [worldID]: 'clean' } })
      })
      $('#' + worldID + '-delete').click(function () {
        $('#' + worldID + '-collapse-delete').collapse('hide')
        chrome.extension.sendMessage({ 'cache': { [worldID]: 'delete' } })
      })

      $('#' + worldID + '-export').click(function () {
        chrome.extension.sendMessage({ 'cache': { [worldID]: 'export' } })
      })

      $('#' + worldID + '-import').change(function (e) {
        importFile(e, worldID)
      })
    })(worldID)
  }
}

function importFile (e, worldID) {
  if (!e.target.files[0]) {
    return
  }
  let reader = new FileReader()
  reader.onload = function (e) {
    let data = e.target.result
    try {
      data = JSON.parse(data)
    } catch (e) {
      // TODO put some nicer message
      alert("Couldn't parse JSON: " + e)
    }
    console.log(data)
    chrome.extension.sendMessage({ 'cache': { [worldID]: 'import', data: data } })
  }
  reader.readAsText(e.target.files[0])
}

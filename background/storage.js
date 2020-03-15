'use strict'

const createRingBuffer = function (length) {
  let pointer = 0; const buffer = []

  return {
    get: function (key) { return buffer[key] },
    push: function (item) {
      buffer[pointer] = item
      pointer = (length + pointer + 1) % length
    },
    length: length
  }
}

var worldID = 'unknown'
function setWorldID (newWorldID) {
  if (worldID === newWorldID + '-') {
    return
  }

  localSet({ _lastWorldID: newWorldID })
  worldID = newWorldID + '-'

  syncGet({ _worlds: [] }, function (result) {
    if (!result._worlds.includes(newWorldID)) {
      if (debug) {
        console.log('New world: ' + newWorldID)
      }
      result._worlds.push(newWorldID)
      syncSet({ _worlds: result._worlds })
    }
    sendWorldsWithDataSize(result._worlds)
  })

  sendMessageCache({ worldID: worldID })
  // dispatch() is an undocumented feature, used to force sending events on same page
  chrome.runtime.onMessage.dispatch({ worldIDChanged: newWorldID })
  if (debug) {
    console.log('Changed world to "' + newWorldID + '"')
  }
}

function listenToWorldIDChanged (callback) {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (Object.prototype.hasOwnProperty.call(request, 'worldIDChanged')) {
        callback(request.worldIDChanged)
      }
    })
}

function toWorldKeys (keys) {
  let worldKeys = {}
  let keysType = typeof keys
  if (Array.isArray(keys)) {
    worldKeys = []
    keysType = 'array'
  }
  switch (keysType) {
    case null:
      worldKeys = null
      break
    case 'string':
      worldKeys = (isInternalKey(keys) ? '' : worldID) + keys
      break
    case 'array':
      for (let i = 0; i < keys.length; i++) {
        worldKeys.push((isInternalKey(keys[i]) ? '' : worldID) + keys[i])
      }
      break
    case 'object':
      for (const key in keys) {
        worldKeys[(isInternalKey(key) ? '' : worldID) + key] = keys[key]
      }
      break
    default:
      sendNotification('err-key-type', 'error', 'unsupported key type: ' + keys)
  }

  return worldKeys
}

function fromWorldResult (worldResult) {
  const result = {}
  if (worldResult) {
    for (const worldKey in worldResult) {
      const key = isInternalKey(worldKey) ? worldKey : worldKey.substring(worldID.length)
      result[key] = worldResult[worldKey]
    }
  }

  return result
}

const usedDataStorages = ['playerArmies', 'playerGBs']
function sendWorldsWithDataSize (worlds) {
  const worldsSize = {}
  for (let i = 0; i < worlds.length; i++) {
    (function (world) {
      const storages = usedDataStorages.map(function (s) { return world + '-' + s })
      chrome.storage.sync.getBytesInUse(storages, function (result) {
        worldsSize[world] = result
        if (Object.keys(worldsSize).length === worlds.length) {
          sendMessageCache({ worlds: worldsSize })
        }
      })
    })(worlds[i])
  }
}

function isInternalKey (key) {
  return key[0] === '_'
}

function syncSet (items, callback) {
  const worldItems = {}
  for (const item in items) {
    worldItems[(isInternalKey(item) ? '' : worldID) + item] = items[item]
  }
  chrome.storage.sync.set(worldItems, function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message)
    }
    if (callback !== undefined) {
      callback(result)
    }
  })
}

function syncGet (keys, callback) {
  chrome.storage.sync.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult))
  })
}

function localSet (items, callback) {
  const worldItems = {}
  for (const item in items) {
    worldItems[(isInternalKey(item) ? '' : worldID) + item] = items[item]
  }
  chrome.storage.local.set(worldItems, function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message)
    }
    if (callback !== undefined) {
      callback(result)
    }
  })
}

function localGet (keys, callback) {
  chrome.storage.local.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult))
  })
}

function localRemove (key) {
  chrome.storage.local.get(null, function (results) {
    for (const entry in results) {
      if (entry.endsWith('-' + key)) {
        chrome.storage.local.remove(entry, function () {
          if (debug) {
            console.log(`Removed ${entry} from storage`)
          }
        })
      }
    }
  })
}

function cacheAction (request) {
  for (worldID in request) {
    if (worldID === 'data') {
      continue
    }
    switch (request[worldID]) {
      case 'clean':
        (function (worldID) {
          chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds }), function (data) {
            let removedItems = 0
            const timeOld = Date.now() - 3 * 7 * 24 * 3600 * 1000
            for (let i = 0; i < usedDataStorages.length; i++) {
              const storageName = worldID + '-' + usedDataStorages[i]
              const ds = data[storageName]
              if (ds === undefined) {
                continue
              }
              for (const key in ds) {
                if (ds[key].lastAccess === undefined || ds[key].lastAccess < timeOld) {
                  delete ds[key]
                  removedItems++
                }
              }
              data[storageName] = ds
            }

            chrome.storage.sync.set(data, function (result) {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message)
              }

              if (debug) {
                console.log('Cleaned ' + removedItems + ' items')
              }
              sendWorldsWithDataSize([worldID])
            })
          })
        })(worldID)
        break
      case 'delete':
        chrome.storage.sync.remove(usedDataStorages.map(function (ds) { return worldID + '-' + ds }), function (result) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
          }
          sendWorldsWithDataSize([worldID])
        })
        break
      case 'import':
        (function (worldID) {
          chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds }), function (data) {
            for (let i = 0; i < usedDataStorages.length; i++) {
              const storageName = worldID + '-' + usedDataStorages[i]
              if (request.data[storageName]) {
                if (trace) {
                  console.log(storageName, request.data[storageName])
                }
                const ds = { ...data[storageName], ...request.data[storageName] }
                data[storageName] = ds
              }
            }

            chrome.storage.sync.set(data, function (result) {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message)
              }

              if (debug) {
                console.log('Imported ' + worldID + ' data')
              }
              sendWorldsWithDataSize([worldID])
            })
          })
        })(worldID)
        break
      case 'export':
        chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds }), function (result) {
          chrome.runtime.sendMessage({ cacheData: { worldID: worldID, data: result } })
        })
        break
      default:
        console.error('unknown cache action "' + request[worldID] + '" for world ' + worldID)
    }
  }
}

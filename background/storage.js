var createRingBuffer = function (length) {
  var pointer = 0, buffer = [];

  return {
    get: function (key) { return buffer[key]; },
    push: function (item) {
      buffer[pointer] = item;
      pointer = (length + pointer + 1) % length;
    },
    length: length
  };
};

var worldID;
function setWorldID (newWorldID) {
  if (worldID === newWorldID + '-') {
    return;
  }

  localSet({_lastWorldID: newWorldID});
  worldID = newWorldID + '-';

  syncGet({_worlds: []}, function (result) {
    if (!result._worlds.includes(newWorldID)) {
      if (debug) {
        console.log('New world: ' + newWorldID);
      }
      result._worlds.push(newWorldID);
      syncSet({_worlds: result._worlds});
    }
    sendWorldsWithDataSize(result._worlds);
  });

  // dispatch() is an undocumented feature, used to force sending events on same page
  chrome.runtime.onMessage.dispatch({worldIDChanged: newWorldID});
  if (debug) {
    console.log('Changed world to "' + newWorldID + '"');
  }
}

function listenToWorldIDChanged (callback) {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.hasOwnProperty('worldIDChanged')) {
        callback(request.worldIDChanged);
      }
    });
}

function toWorldKeys (keys) {
  worldKeys = {};
  keysType = typeof keys;
  if (Array.isArray(keys)) {
    worldKeys = [];
    keysType = 'array';
  }
  switch (keysType) {
    case null:
      worldKeys = null;
      break;
    case 'string':
      worldKeys = (isInternalKey(keys) ? '' : worldID) + keys;
      break;
    case 'array':
      for (var i = 0; i < keys.length; i++) {
        worldKeys.push((isInternalKey(keys[i]) ? '' : worldID) + keys[i]);
      }
      break;
    case 'object':
      for (key in keys) {
        worldKeys[(isInternalKey(key) ? '' : worldID) + key] = keys[key];
      }
      break;
    default:
      sendNotification('err-key-type', 'error', 'unsupported key type: ' + keys);
  }

  return worldKeys;
}

function fromWorldResult (worldResult) {
  var result = {};
  if (worldResult) {
    for (worldKey in worldResult) {
      key = isInternalKey(worldKey) ? worldKey : worldKey.substring(worldID.length);
      result[key] = worldResult[worldKey];
    }
  }

  return result;
}

const usedDataStorages = ['playerArmies', 'playerGBs'];
function sendWorldsWithDataSize (worlds) {
  worldsSize = {};
  for (var i = 0; i < worlds.length; i++) {
    (function (world) {
      storages = usedDataStorages.map(function (s) { return world + '-' + s; });
      chrome.storage.sync.getBytesInUse(storages, function (result) {
        worldsSize[world] = result;
        if (Object.keys(worldsSize).length == worlds.length) {
          sendMessageCache({worlds: worldsSize});
        }
      });
    })(worlds[i]);
  }
}

function isInternalKey (key) {
  return key[0] == '_';
}

function syncSet (items, callback) {
  worldItems = {};
  for (item in items) {
    worldItems[(isInternalKey(item) ? '' : worldID) + item] = items[item];
  }
  chrome.storage.sync.set(worldItems, function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    if (callback !== undefined) {
      callback(result);
    }
  });
}

function syncGet (keys, callback) {
  chrome.storage.sync.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult));
  });
}

function localSet (items, callback) {
  worldItems = {};
  for (item in items) {
    worldItems[(isInternalKey(item) ? '' : worldID) + item] = items[item];
  }
  chrome.storage.local.set(worldItems, function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    if (callback !== undefined) {
      callback(result);
    }
  });
}

function localGet (keys, callback) {
  chrome.storage.local.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult));
  });
}

function cacheAction (request) {
  for (worldID in request) {
    if (worldID === 'data') {
      continue;
    }
    switch (request[worldID]) {
      case 'clean':
        (function (worldID) {
          chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds; }), function (data) {
            removedItems = 0;
            timeOld = Date.now() - 3 * 7 * 24 * 3600 * 1000;
            for (var i = 0; i < usedDataStorages.length; i++) {
              ds = data[worldID + '-' + usedDataStorages[i]];
              if (ds === undefined) {
                continue;
              }
              for (key in ds) {
                if (ds[key].lastAccess === undefined || ds[key].lastAccess < timeOld) {
                  delete ds[key];
                  removedItems++;
                }
              }
              data[worldID + '-' + usedDataStorages[i]] = ds;
            }

            chrome.storage.sync.set(data, function (result) {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              }

              if (debug) {
                console.log('Cleaned ' + removedItems + ' items');
              }
              sendWorldsWithDataSize([worldID]);
            });
          });
        })(worldID);
        break;
      case 'delete':
        chrome.storage.sync.remove(usedDataStorages.map(function (ds) { return worldID + '-' + ds; }));
        break;
      case 'import':
        (function (worldID) {
          chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds; }), function (data) {
            for (var i = 0; i < usedDataStorages.length; i++) {
              storageName = worldID + '-' + usedDataStorages[i];
              if (request.data[storageName]) {
                if (trace) {
                  console.log(storageName, request.data[storageName]);
                }
                ds = {...data[storageName], ...request.data[storageName]};
                data[storageName] = ds;
              }
            }

            chrome.storage.sync.set(data, function (result) {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              }

              if (debug) {
                console.log('Imported ' + worldID + ' data');
              }
              sendWorldsWithDataSize([worldID]);
            });
          });
        })(worldID);
        break;
      case 'export':
        chrome.storage.sync.get(usedDataStorages.map(function (ds) { return worldID + '-' + ds; }), function (result) {
          chrome.runtime.sendMessage({cacheData: { worldID: worldID, data: result}});
        });
        break;
      default:
        console.error('unknown cache action "' + request[worldID] + '" for world ' + worldID);
    }
  }
}

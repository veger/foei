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
  switch (typeof keys) {
    case null:
      worldKeys = null;
      break;
    case 'string':
      worldKeys = (isInternalKey(keys) ? '' : worldID) + keys;
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
          console.log(worldsSize);
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
  chrome.storage.sync.set(worldItems, callback);
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
  chrome.storage.local.set(worldItems, callback);
}

function localGet (keys, callback) {
  chrome.storage.local.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult));
  });
}

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

function toWorldKeys (keys) {
  worldKeys = {};
  switch (typeof keys) {
    case null:
      worldKeys = null;
      break;
    case 'string':
      worldKeys = (isInternalKey(keys) ? '' : 'nl1-') + keys;
      break;
    case 'object':
      for (key in keys) {
        worldKeys[(isInternalKey(keys) ? '' : 'nl1-') + key] = keys[key];
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
      key = isInternalKey(worldKey) ? worldKey : worldKey.substring('nl1-'.length);
      result[key] = worldResult[worldKey];
    }
  }

  return result;
}

function isInternalKey (key) {
  return key[0] == '_';
}

function syncSet (items, callback) {
  worldItems = {};
  for (item in items) {
    worldItems[(isInternalKey(item) ? '' : 'nl1-') + item] = items[item];
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
    worldItems[(isInternalKey(item) ? '' : 'nl1-') + item] = items[item];
  }
  chrome.storage.local.set(worldItems, callback);
}

function localGet (keys, callback) {
  chrome.storage.local.get(toWorldKeys(keys), function (worldResult) {
    callback(fromWorldResult(worldResult));
  });
}

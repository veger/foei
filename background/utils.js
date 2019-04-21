function humanReadableTime(seconds) {
  var hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  var minutes = '0' + Math.floor(seconds / 60);
  seconds -= minutes * 60;
  seconds = '0' + Math.floor(seconds);
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function sortByKey(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function sortByKeyMultiple() {
  // Save arguments as inner function will have its own
  var props = arguments;
  return function (a, b) {
    var i = 0, result = 0, numberOfProperties = props.length;
    while (result === 0 && i < numberOfProperties) {
      result = sortByKey(props[i])(a, b);
      i++;
    }
    return result;
  }
}

function mapEqual(map1, map2, reversedOrder) {
  for (propName in map1) {
    if (!map1.hasOwnProperty(propName)) {
      continue;
    }

    if (!map2.hasOwnProperty(propName)) {
      return false;
    }
    if (map1[propName] != map2[propName]) {
      return false;
    }
  }
  // Make sure that all key/values of map2 are also present in map1
  return (reversedOrder ? true : mapEqual(map2, map1, true));
}

function copyProductResources(result) {
  productResources = { goods: {} };

  if (result.product !== undefined && result.product.resources !== undefined) {
    for (var resource in result.product.resources) {
      if (result.product.resources.hasOwnProperty(resource)) {
        if (consts.goods[resource] !== undefined) {
          productResources.goods[resource] = result.product.resources[resource];
        } else {
          productResources[resource] = result.product.resources[resource];
        }
      }
    }
  }
  if (entity.state.current_product && result.current_product.clan_power) {
    productResources['clan_power'] = entity.state.current_product.clan_power;
  }
  if (Object.keys(productResources.goods).length == 0) {
    delete productResources.goods;
  }
  if (Object.keys(productResources).length > 1) {
    return productResources;
  }

  return undefined;
}

var msgCache = {};

function sendMessageCache(msg) {
  chrome.runtime.sendMessage(msg);

  msgCache = { ...msgCache, ...msg };
}

function sendNotification(id, type, message) {
  notifications = msgCache.notifications || {};
  if (message == '') {
    // Clear message
    delete notifications[id];
  } else {
    notifications[id] = {
      type: type,
      msg: message
    };
    if (debug) {
      switch (type) {
        case 'info':
          console.log(message);
          break;
        case 'warning':
          console.warn(message);
          break;
        default:
          console.error(message);
          break;
      }
    }
  }

  // Send and update
  sendMessageCache({ notifications: notifications });
}

function sendPlayerArmies(playerId) {
  syncGet({ 'playerArmies': {} }, function (result) {
    playerArmies = result.playerArmies;
    var armyDetails = playerArmies[playerId] || {};

    chrome.runtime.sendMessage({ 'battleStats': armyDetails });
  });
}

function fixFloat(number) {
  return parseFloat(parseFloat(number).toPrecision(4));
}

'use strict'

function humanReadableTime (seconds) {
  const hours = Math.floor(seconds / 3600)
  seconds -= hours * 3600
  const minutes = '0' + Math.floor(seconds / 60)
  seconds -= minutes * 60
  seconds = '0' + Math.floor(seconds)
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}

function sortByKey (property) {
  let sortOrder = 1
  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }
  return function (a, b) {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
    return result * sortOrder
  }
}

function sortByKeyMultiple () {
  // Save arguments as inner function will have its own
  const props = arguments
  return function (a, b) {
    let i = 0; let result = 0; const numberOfProperties = props.length
    while (result === 0 && i < numberOfProperties) {
      result = sortByKey(props[i])(a, b)
      i++
    }
    return result
  }
}

function mapEqual (map1, map2, reversedOrder) {
  for (const propName in map1) {
    if (!Object.prototype.hasOwnProperty.call(map1, propName)) {
      continue
    }

    if (!Object.prototype.hasOwnProperty.call(map2, propName)) {
      return false
    }
    if (map1[propName] !== map2[propName]) {
      return false
    }
  }
  // Make sure that all key/values of map2 are also present in map1
  return (reversedOrder ? true : mapEqual(map2, map1, true))
}

function copyProductResources (result) {
  const productResources = { resources: {} }

  if (result.product !== undefined && result.product.resources !== undefined) {
    for (const resource in result.product.resources) {
      if (Object.prototype.hasOwnProperty.call(result.product.resources, resource)) {
        if (consts.resources[resource] !== undefined && consts.resources[resource].era !== 'NoAge') {
          productResources.resources[resource] = result.product.resources[resource]
        } else {
          productResources[resource] = result.product.resources[resource]
        }
      }
    }
  }
  if (result.current_product && result.current_product.clan_power) {
    productResources.clan_power = result.current_product.clan_power
  }
  if (Object.keys(productResources.resources).length === 0) {
    delete productResources.resources
  }
  if (Object.keys(productResources).length > 1) {
    return productResources
  }

  return undefined
}

let msgCache = {}

function sendMessageCache (msg) {
  chrome.runtime.sendMessage(msg)

  msgCache = { ...msgCache, ...msg }
}

function sendNotification (id, type, message) {
  const notifications = msgCache.notifications || {}
  if (message === '') {
    // Clear message
    delete notifications[id]
  } else {
    notifications[id] = {
      type: type,
      msg: message
    }
    if (debug) {
      switch (type) {
        case 'info':
          console.log(message)
          break
        case 'warning':
          console.warn(message)
          break
        default:
          console.error(message)
          break
      }
    }
  }

  // Send and update
  sendMessageCache({ notifications: notifications })
}

function sendPlayerArmies (playerId) {
  syncGet({ playerArmies: {} }, function (result) {
    const playerArmies = result.playerArmies
    const armyDetails = playerArmies[playerId] || {}

    chrome.runtime.sendMessage({ battleStats: armyDetails })
  })
}

function fixFloat (number) {
  return parseFloat(parseFloat(number).toPrecision(4))
}

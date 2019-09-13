'use strict'

const otherPlayer = {
  protectedPlayers: {},
  process: function (method, data) {
    if (trace) {
      console.log('OtherPlayerService.' + method, data)
    }
    switch (method) {
      case 'visitPlayer':
        let results = otherPlayer.processEntities(data.city_map.entities)
        console.log('rewards', results)

        // Show full rewards, not only max!
        let suppliesMax = { value: 0 }
        let moneyMax = { value: 0 }
        let spMax = { value: 0 }
        let medalsMax = { value: 0 }
        let clanPowerMax = { value: 0 }
        let resources = []
        for (let i = 0; i < results.length; i++) {
          let result = results[i]
          if (result.product !== undefined && result.product.resources !== undefined && result.type !== 'random_production') {
            let resourcesValue = consts.valueResources(result.product.resources)
            if (resourcesValue > 0) {
              resources.push({
                amount: consts.amountResources(result.product.resources),
                name: result.id,
                all: copyProductResources(result),
                value: resourcesValue,
                // TODO Get total stock (although it would be a huge coincidence that 2 'multi resource' results have exactly the same value...)
                stock: (resource.resources[worldID] || {})[Object.keys(result.product.resources)[0]] || 0,
                raw: result.product.resources
              })
            }
            if (result.product.resources.money > moneyMax.value) {
              moneyMax = { value: result.product.resources.money, name: result.id, all: copyProductResources(result) }
            }
            if (result.product.resources.supplies > suppliesMax.value) {
              suppliesMax = { value: result.product.resources.supplies, name: result.id, all: copyProductResources(result) }
            }
            if (result.product.resources.medals > medalsMax.value) {
              medalsMax = { value: result.product.resources.medals, name: result.id, all: copyProductResources(result) }
            }
            if (result.product.resources.strategy_points && otherPlayer.spMoreValuable(result.product.resources, spMax)) {
              spMax = { value: result.product.resources.strategy_points, name: result.id, all: copyProductResources(result) }
            }
          } else {
            if (debug) {
              console.warn('no-revenue', result)
            }
          }
          if (result.clan_power && result.clan_power > clanPowerMax.value) {
            clanPowerMax = { value: result.clan_power, name: result.id, all: copyProductResources(result) }
          }
        }
        if (spMax.value > 0) {
          console.log('sp', spMax)
        }
        if (resources.length > 0) {
          resources = resources.sort(sortByKeyMultiple('-value', 'stock'))
          console.log('resources', resources)
        }
        if (moneyMax.value > 0) {
          console.log('money', moneyMax)
        }
        if (suppliesMax.value > 0) {
          console.log('supplies', suppliesMax)
        }
        if (medalsMax.value > 0) {
          console.log('medals', medalsMax)
        }
        if (clanPowerMax.value > 0) {
          console.log('clan power', clanPowerMax)
        }
        sendMessageCache({
          'revenue': {
            spMax: spMax,
            resources: resources,
            moneyMax: moneyMax,
            suppliesMax: suppliesMax,
            medalsMax: medalsMax,
            clanPowerMax: clanPowerMax
          }
        })

        // Provide battle information of this player
        otherPlayer.sendPlayerProtected(data.other_player.player_id)
        sendPlayerArmies(data.other_player.player_id)

        // Store additional player info (e.g. to reduce risk in GB)
        otherPlayer.setPlayerActive(data.other_player.player_id, data.other_player.is_active === true)
        break
      case 'getOtherPlayerVO':
        otherPlayer.setPlayerActive(data.player_id, data.is_active === true)
        break
      case 'getCityProtections':
        let protectedPlayers = []
        for (let i = 0; i < data.length; i++) {
          protectedPlayers.push(data[i].playerId)
        }
        otherPlayer.protectedPlayers[worldID] = protectedPlayers
        if (debug) {
          console.log(protectedPlayers.length + ' protected player(s)')
        }
        break
      default:
        if (trace || debug) {
          console.log('OtherPlayerService.' + method + ' is not used')
        }
    }
  },
  processEntities: function (entities) {
    let result = []
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      try {
        // TODO Figure out if available, or producing
        switch (entity.type) {
          case 'production':
          case 'goods':
          case 'random_production':
          case 'residential':
            if (entity.state.boosted !== true &&
               entity.state.current_product !== undefined &&
               entity.state.__class__ === 'ProductionFinishedState' &&
                !entity.cityentity_id.match(/R_MultiAge_SummerBonus19[a-h]/) // The Crow's Nest cannot be plundered...
            ) {
              let era = consts.getEra(entity.cityentity_id.split('_')[1])
              result.push({
                era: era,
                id: entity.cityentity_id,
                type: entity.type,
                state: entity.state.__class__,
                product: entity.state.current_product.product,
                clan_power: entity.state.current_product.clan_power,
                full_info: entity
              })
            }
            break
        }
      } catch (e) {
        console.log('Failed to process entity', e)
        console.log(entity)
      }
    }

    return result
  },
  spMoreValuable: function (newRevenue, currentRevenue) {
    if (newRevenue.strategy_points !== currentRevenue.value) {
      return newRevenue.strategy_points > currentRevenue.value
    }

    // Compare resources value
    let newResourcesValue = consts.valueResources(newRevenue)
    let currentResourcesValue = consts.valueResources(currentRevenue)
    if (newResourcesValue < currentResourcesValue) {
      return false
    }

    // Compare Money and Supplies
    let newMSValue = (newRevenue.money || 0) + (newRevenue.supplies || 0)
    let currentMSValue = currentRevenue.all ? (currentRevenue.all.money || 0) + (currentRevenue.all.supplies || 0) : 0

    return newMSValue > currentMSValue
  },
  sendPlayerProtected: function (playerId) {
    chrome.runtime.sendMessage({ 'playerProtected': otherPlayer.protectedPlayers[worldID] !== undefined && otherPlayer.protectedPlayers[worldID].includes(playerId) })
  },
  setPlayerActive: function (playerId, active) {
    syncGet({ 'playerInfo': {} }, function (result) {
      let playerInfo = result.playerInfo
      if (playerInfo[playerId] === undefined) {
        playerInfo[playerId] = {}
      }
      if (trace && playerInfo[playerId].active !== active) {
        console.log(`Setting player ${playerId} to ` + (active ? 'active' : 'inactive'))
      }
      playerInfo[playerId].active = active

      // always refresh date
      playerInfo[playerId].lastUpdate = Date.now() / 1000
      syncSet({ 'playerInfo': playerInfo })
    })
  }
}

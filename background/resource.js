'use strict'

const resource = {
  resources: {},
  process: function (method, data) {
    if (trace) {
      console.log('ResourceService.' + method, data)
    }
    switch (method) {
      case 'getPlayerResources':
        resource.get(function (resources) {
          if (resources === undefined) {
            // There are really no resources yet... We'll come back later
            return
          }
          let worldResources = {}
          for (let resource of Object.getOwnPropertyNames(resources)) {
            if (data.resources[resource] > 0) {
              worldResources[resource] = data.resources[resource]
            }
          }
          if (debug) {
            console.log('Player has ' + consts.amountResources(worldResources) + ' resources in stock')
          }
          resource.resources[worldID] = worldResources
        })
        break
      case 'getResourceDefinitions':
        let resources = {}
        for (let i = 0; i < data.length; i++) {
          resources[data[i].id] = {
            era: data[i].era,
            name: data[i].name
          }
        }
        resource.set(resources)
        break
      default:
        if (trace || debug) {
          console.log('ResourceService.' + method + ' is not used')
        }
    }
  },
  set: function (resources) {
    if (resources !== undefined && Object.keys(resources).length > 0) {
      if (debug) {
        console.log(Object.keys(resources).length + ' resources registered')
      }

      localSet({ 'resources': resources })
      consts.resources = resources
      sendNotification('resources', '', '')
      sendMessageCache({ resources: resources })
    }
  },
  get: function (cb) {
    if (consts.resources !== undefined) {
      cb(consts.resources)
    }

    // Handle resources not being available yet (eg during startup)
    localGet({ 'resources': {} }, function (result) {
      resource.set(result.resources)
      cb(result.resources)
    })
  }
}

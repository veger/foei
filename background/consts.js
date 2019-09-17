'use strict'

const consts = {
  eras: {
    NoAge: 1,
    AllAge: 1,
    MultiAge: 1,
    StoneAge: 2,
    BronzeAge: 2,
    IronAge: 3,
    EarlyMiddleAge: 4,
    HighMiddleAge: 5,
    LateMiddleAge: 6,
    ColonialAge: 7,
    ProgressiveEra: 8,
    IndustrialAge: 9,
    ModernEra: 10,
    PostModernEra: 11,
    ContemporaryEra: 12,
    TomorrowEra: 13,
    FutureEra: 14,
    ArcticFuture: 15,
    OceanicFuture: 16,
    VirtualFuture: 17,
    SpaceAgeMars: 18
  },

  getResourcesEra: function (resourceName) {
    if (!consts.resources.hasOwnProperty(resourceName)) {
      sendNotification('missingResource', 'error', resourceName + ' is missing in resources')
      return 1
    }
    let resourceAge = consts.resources[resourceName].era
    return consts.getEra(resourceAge)
  },

  getEra: function (era) {
    if (consts.eras[era] !== undefined) {
      return consts.eras[era]
    }

    sendNotification('missingAge', 'warning', era + ' is missing in eras')

    return 1
  },

  valueResources: function (resourcesArray) {
    let amount = 0
    for (let resourceName in resourcesArray) {
      if (resourcesArray.hasOwnProperty(resourceName) && consts.resources[resourceName] !== undefined && consts.resources[resourceName].era !== 'NoAge') {
        amount += resourcesArray[resourceName] * Math.pow(2, consts.getResourcesEra(resourceName) - 1)
      }
    }
    return amount
  },

  amountResources: function (resourcesArray) {
    let amount = 0
    for (let resourceName in resourcesArray) {
      if (resourcesArray.hasOwnProperty(resourceName) && consts.resources[resourceName] !== undefined && consts.resources[resourceName].era !== 'NoAge') {
        amount += resourcesArray[resourceName]
      }
    }
    return amount
  }
}

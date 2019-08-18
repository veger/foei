'use strict'

const consts = {
  ages: {
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

  getGoodsAge: function (goodName) {
    if (!consts.goods.hasOwnProperty(goodName)) {
      sendNotification('missingGood', 'error', goodName + ' is missing in goods')
      return 1
    }
    let goodAge = consts.goods[goodName]
    return consts.getAge(goodAge)
  },

  getAge: function (age) {
    if (consts.ages[age] !== undefined) {
      return consts.ages[age]
    }

    sendNotification('missingAge', 'warning', age + ' is missing in ages')

    return 1
  },

  valueGoods: function (goodsArray) {
    let amount = 0
    for (let goodName in goodsArray) {
      if (goodsArray.hasOwnProperty(goodName) && consts.goods[goodName] !== undefined) {
        amount += goodsArray[goodName] * Math.pow(2, consts.getGoodsAge(goodName) - 1)
      }
    }
    return amount
  },

  amountGoods: function (goodsArray) {
    let amount = 0
    for (let goodName in goodsArray) {
      if (goodsArray.hasOwnProperty(goodName) && consts.goods[goodName] !== undefined) {
        amount += goodsArray[goodName]
      }
    }
    return amount
  },

  units: {
    // BronzeAge
    javeliner: { name: 'Spearfighter', type: 'light' },
    hoplite: { name: 'Warrior', type: 'heavy' },
    slinger: { name: 'Slinger', type: 'ranged' },
    horseman: { name: 'Horseman', type: 'fast' },
    palintona: { name: 'Stone Thrower', type: 'artillery' },

    // Iron Age
    militiaman: { name: 'Soldier', type: 'light' },
    legionnaire: { name: 'Legionnaire', type: 'heavy' },
    archer: { name: 'Archer', type: 'ranged' },
    mounted_legionnaire: { name: 'Mounted Warrior', type: 'fast' },
    balista: { name: 'Ballista', type: 'artillery' },

    // Early Middle Ages
    mounted_bowman: { name: 'Mounted Archer', type: 'ranged' },
    catapult: { name: 'Catapult', type: 'artillery' },
    cataphract: { name: 'Heavy Cavalry', type: 'fast' },
    spearman: { name: 'Mercenary', type: 'light' },
    armoredswordsman: { name: 'Armored Infantry', type: 'heavy' },

    // High Middle Ages
    trebuchet: { name: 'Trebuchet', type: 'artillery' },
    feudal_knight: { name: 'Knight', type: 'fast' },
    crossbowman: { name: 'Crossbowman', type: 'ranged' },
    dismounted_knight: { name: 'Heavy Infantry', type: 'heavy' },
    axe_hammer_warrior: { name: 'Berserker', type: 'light' },

    // Late Middle Ages
    bombarde: { name: 'Cannon', type: 'artillery' },
    imperial_knight: { name: 'Heavy Knight', type: 'fast' },
    biedenhaender_mercenary: { name: 'Great Sword Warrior', type: 'light' },
    pikeman: { name: 'Imperial Guard', type: 'heavy' },
    longbowman: { name: 'Longbow Archer', type: 'ranged' },

    // Colonial Age
    marksman: { name: 'Musketeer', type: 'ranged' },
    grenadier: { name: 'Grenadier', type: 'heavy' },
    dragoon: { name: 'Dragoon', type: 'fast' },
    cannoniers: { name: 'Field Gun', type: 'artillery' },
    ranger: { name: 'Ranger', type: 'light' },

    // Industrial Age
    jaeger: { name: 'Jaeger Infantry', type: 'light' },
    lancer: { name: 'Lancer', type: 'fast' },
    rifleman: { name: 'Rifleman', type: 'ranged' },
    howitzer: { name: 'Howitzer', type: 'heavy' },
    breech_loader: { name: 'Breech Loader', type: 'artillery' },

    // Progressive Era
    conscript: { name: 'Conscript', type: 'light' },
    armored_car: { name: 'Armored Car', type: 'fast' },
    tank: { name: 'Tank', type: 'heavy' },
    sniper: { name: 'Sniper', type: 'ranged' },
    rf_cannon: { name: 'Rapid Fire Cannon', type: 'artillery' },

    // Modern
    bazooka: { name: 'Bazooka Team', type: 'light' },
    mech_artillery: { name: 'Mechanized Artillery', type: 'artillery' },
    mech_infantry: { name: 'Mechanized Infantry', type: 'light' },
    battle_tank: { name: 'Battle Tank', type: 'heavy' },
    paratrooper: { name: 'Paratrooper', type: 'ranged' },

    // Post modern
    automatic_rifleman: { name: 'MG Team', type: 'ranged' },
    commando: { name: 'Commando', type: 'light' },

    // Virtual Future
    ninja: { name: 'Ninja', type: 'ranged' },
    augmented_samurai: { name: 'Augmented Samurai', type: 'light' },
    warrior_monk: { name: 'Warrior Monk', type: 'fast' },
    ronin_bot: { name: 'Ronin Bot', type: 'heavy' },
    rocket_troop: { name: 'Rocket Troop', type: 'artillery' },

    // All Ages
    military_drummer: { name: 'Military Drummer', type: 'drum' },
    color_guard: { name: 'Color Guard', type: 'cguard' },
    rogue: { name: 'Rogue', type: 'rogue' },

    // Champions
    BronzeAge_champion: { name: 'Champion', type: 'champ' },
    IronAge_champion: { name: 'Champion', type: 'champ' },
    EarlyMiddleAge_champion: { name: 'Champion', type: 'champ' },
    HighMiddleAge_champion: { name: 'Champion', type: 'champ' },
    LateMiddleAge_champion: { name: 'Champion', type: 'champ' },
    ColonialAge_champion: { name: 'Champion', type: 'champ' },
    IndustrialAge_champion: { name: 'Champion', type: 'champ' },
    ProgressiveEra_champion: { name: 'Champion', type: 'champ' },
    PostModernEra_champion: { name: 'Champion', type: 'champ' },
    ModernEra_champion: { name: 'Champion', type: 'champ' },
    VirtualFuture_champion: { name: 'Champion', type: 'champ' }
  }
}

consts = {
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
    VirtualFuture: 17
  },

  getGoodsAge: function (goodName) {
    if (!consts.goods.hasOwnProperty(goodName)) {
      sendNotification('missingGood', 'error', goodName + ' is missing in goods');
      return 1;
    }
    goodAge = consts.goods[goodName];
    return consts.getAge(goodAge);
  },

  getAge: function (age) {
    if (consts.ages[age] !== undefined) {
      return consts.ages[age];
    }

    sendNotification('missingAge', 'warning', age + ' is missing in ages');

    return 1;
  },

  valueGoods: function (goodsArray) {
    amount = 0;
    for (var goodName in goodsArray) {
      if (goodsArray.hasOwnProperty(goodName) && consts.goods[goodName] !== undefined) {
        amount += goodsArray[goodName] * Math.pow(2, consts.getGoodsAge(goodName) - 1);
      }
    }
    return amount;
  },

  amountGoods: function (goodsArray) {
    amount = 0;
    for (var goodName in goodsArray) {
      if (goodsArray.hasOwnProperty(goodName) && consts.goods[goodName] !== undefined) {
        amount += goodsArray[goodName];
      }
    }
    return amount;
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

    // All Ages
    military_drummer: { name: 'Military Drummer', type: 'drum' },
    color_guard: { name: 'Color Guard', type: 'cguard' },
    rogue: { name: 'Rogue', type: 'rogue' },

    // Champions
    IronAge_champion: { name: 'Champions', type: 'champ' },
    EarlyMiddleAge_champion: { name: 'Champions', type: 'champ' },
    HighMiddleAge_champion: { name: 'Champions', type: 'champ' },
    LateMiddleAge_champion: { name: 'Champions', type: 'champ' },
    ColonialAge_champion: { name: 'Champions', type: 'champ' }
  }
};

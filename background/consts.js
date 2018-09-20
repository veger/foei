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
    Today: 12,
    Tomorrow: 13,
    FutureEra: 14,
    ArcticFuture: 15,
    OceanicFuture: 16,
    VirtualFuture: 17
  },

  goods: {
    cypress: 'BronzeAge',
    wine: 'BronzeAge',
    dye: 'BronzeAge',
    sandstone: 'BronzeAge',
    marble: 'BronzeAge',

    gems: 'IronAge',
    lead: 'IronAge',
    ebony: 'IronAge',
    limestone: 'IronAge',
    cloth: 'IronAge',

    honey: 'EarlyMiddleAge',
    gold: 'EarlyMiddleAge',
    bronze: 'EarlyMiddleAge',
    granite: 'EarlyMiddleAge',
    alabaster: 'EarlyMiddleAge',

    glass: 'HighMiddleAge',
    salt: 'HighMiddleAge',
    ropes: 'HighMiddleAge',
    brick: 'HighMiddleAge',
    herbs: 'HighMiddleAge',

    silk: 'LateMiddleAge',
    gunpowder: 'LateMiddleAge',
    brass: 'LateMiddleAge',
    basalt: 'LateMiddleAge',
    talc: 'LateMiddleAge',

    coffee: 'ColonialAge',
    wire: 'ColonialAge',

    tinplate: 'ProgressiveEra',
    asbestos: 'ProgressiveEra',

    coke: 'IndustrialAge',

    ferroconcrete: 'ModernEra',
    convenience_food: 'ModernEra',
    luxury_materials: 'ModernEra',

    renewable_resources: 'PostModernEra',
    steel: 'PostModernEra',
    semiconductors: 'PostModernEra',
    filters: 'PostModernEra',
    dna_data: 'PostModernEra',

    biogeochemical_data: 'FutureEra',
    purified_water: 'FutureEra',
    algae: 'FutureEra',
    superconductors: 'FutureEra',
    nanoparticles: 'FutureEra',

    paper_batteries: 'ArcticFuture',
    ai_data: 'ArcticFuture',

    pearls: 'OceanicFuture',
    artificial_scales: 'OceanicFuture',
    corals: 'OceanicFuture',
    biolight: 'OceanicFuture',
    plankton: 'OceanicFuture',

    tea_silk: 'VirtualFuture',
    data_crystals: 'VirtualFuture',
    golden_rice: 'VirtualFuture',
    nanites: 'VirtualFuture',
    cryptocash: 'VirtualFuture'
  },

  getGoodsAge: function (goodName) {
    if (!consts.goods.hasOwnProperty(goodName)) {
      console.error(goodName + ' is missing in goods');
      return 1;
    }
    goodAge = consts.goods[goodName];
    return consts.getAge(goodAge);
  },

  getAge: function (age) {
    if (consts.ages.hasOwnProperty(age)) {
      return consts.ages[age];
    }

    console.error(age + ' is missing in ages');

    return 1;
  },

  valueGoods: function (goodsArray) {
    amount = 0;
    for (var i = 0; i < goodsArray.length; i++) {
      amount += goodsArray[i].value * consts.getGoodsAge(goodsArray[i].good_id);
    }
    return amount;
  },

  amountGoods: function (goodsArray) {
    amount = 0;
    for (var i = 0; i < goodsArray.length; i++) {
      amount += goodsArray[i].value;
    }
    return amount;
  }

// "R_MultiAge_SummerBonusSetA17a" -> Maharaja's Palace
// "R_MultiAge_SummerBonusSetB17b" -> Elephant Fountain Gate
// "P_MultiAge_SportBonus17" -> Overwinnaars arena
// "P_MultiAge_CarnivalBonus17" -> Masquerade Ball
// "P_MultiAge_CarnivalBonus18" -> Gondola Dock Market
// "R_MultiAge_CarnivalBonus18c" -> ? Grand Bridge ?
// "R_LateMiddleAge_Residential3" -> Kasteel
// "L_AllAge_SpringBonusSet17" -> ? Gong of Wisdom ?
// "R_MultiAge_SpringBonusSet17a" -> Zen Zone
// "R_MultiAge_SpringBonusSet17b -> "Emperor's Entrance
// "R_MultiAge_SpringBonusSet18a" -> Zen Zone (lvl2)
// "R_MultiAge_SpringBonusSet18b -> "Emperor's Entrance (lvl2)
// "R_MultiAge_RoyalBonusSet17a" -> King Statue
// "R_MultiAge_RoyalBonusSet17b" -> Queens Statue
// "P_MultiAge_FallBonus17a" -> Blooming Cider Mill
// "P_MultiAge_FallBonus17b" -> Fruitful Cider Mill
// "P_MultiAge_FallBonus17c" -> Bountiful Cider Mill
// "P_MultiAge_SummerBonus15" -> Bazaar
// "P_MultiAge_SummerBonus16" -> Luau
// "P_MultiAge_SummerBonus18" -> Sunken Treasure
// "P_MultiAge_HalloweenBonus15" -> Mad Scientist's Lab
// "P_MultiAge_ChristmasBonus16" -> Santa's Workshop
// "R_MultiAge_NapoleonBonus18" -> Royal Marble Gateway
// "P_MultiAge_Aviary" -> Aviary
};

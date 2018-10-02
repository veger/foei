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
    alabaster: 'BronzeAge', // bug in game?

    gems: 'IronAge',
    lead: 'IronAge',
    ebony: 'IronAge',
    limestone: 'IronAge',
    cloth: 'IronAge',

    honey: 'EarlyMiddleAge',
    gold: 'EarlyMiddleAge',
    bronze: 'EarlyMiddleAge',
    granite: 'EarlyMiddleAge',
    marble: 'EarlyMiddleAge', // bug in game?

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
      amount += goodsArray[i].value * Math.pow(2, consts.getGoodsAge(goodsArray[i].good_id) - 1);
    }
    return amount;
  },

  amountGoods: function (goodsArray) {
    amount = 0;
    for (var i = 0; i < goodsArray.length; i++) {
      amount += goodsArray[i].value;
    }
    return amount;
  },

  units: {
    javeliner: { name: 'Speerman', type: 'licht' },

    militiaman: { name: 'Soldaat', type: 'licht' },
    armoredswordsman: { name: 'Gepasterde infaterie', type: 'zwaar' },
    archer: { name: 'Boogschutter', type: 'range'},

    mounted_bowman: { name: 'Bereden boogschutter', type: 'range'},

    catapult: { name: 'Katapult', type: 'kata'},
    cataphract: { name: 'Zware calvalerie', type: 'snel' },

    trebuchet: { name: 'Trebuchet', type: 'treb' },
    feudal_knight: { name: 'Ridder', type: 'snel' },
    crossbowman: { name: 'Kruisboogschutter', type: 'range' },
    legionnaire: { name: 'Legionair', type: '' },
    dismounted_knight: { name: 'Zware infanterie', type: 'zwaar' },
    axe_hammer_warrior: { name: 'Berserker', type: 'licht' },

    bombarde: { name: 'Kanon', type: 'kanon' },
    imperial_knight: { name: 'Zware ridder', type: 'snel' },
    biedenhaender_mercenary: { name: 'Langzwaardkrijger', type: 'licht' },
    pikeman: { name: 'Keizerlijke garde', type: 'zwaar' },
    longbowman: {name: 'Langboogshutter', type: 'range' },

    marksman: {name: 'Musketier', type: 'musk'},
    grenadier: { name: 'Grenadier', type: 'gren' },
    cannoniers: { name: 'Veldkanon', type: 'vkanon' },

    EarlyMiddleAge_champion: { name: 'Kampioen', type: 'champ' },
    HighMiddleAge_champion: { name: 'Kampioen', type: 'champ' },
    LateMiddleAge_champion: { name: 'Kampioen', type: 'champ' },
    color_guard: { name: 'Vaandeldrager', type: 'vaandel' },
    military_drummer: { name: 'Militaire drummer', type: 'drum' },
    rogue: { name: 'Schurk', type: 'schurk' }
  }
};

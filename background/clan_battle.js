const clanBattle = {
  process: function (method, data, id) {
    if (trace) {
      console.log('ClanBattleService.' + method, data)
    }
    switch (method) {
      case 'getProvinceSectorDetailed':
        const armies = clanBattle.getArmies(data.defending_armies)
        console.log(armies)
        sendMessageCache({ clanArmies: armies })
        break
      default:
        if (trace || debug) {
          console.log('ClanBattleService.' + method + ' is not used')
        }
    }
  },

  getArmies: function (data) {
    let armies = []
    for (let army of Object.values(data)) {
      let armyData = {}
      for (let unit of Object.values(army.units)) {
        armyData[unit.unitTypeId] = (armyData[unit.unitTypeId] || 0) + 1
      }
      armies.push({ units: armyData, hp: army.hitpoints })
    }
    return armies
  }
}

var data = [
  {
    'hitpoints': 10,
    'support_bonus': 42,
    'id': 798880,
    'name': 'DefendingArmy',
    'units': [
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'terrains': [
              'plain'
            ],
            'type': 'stealth',
            'name': 'Verbergen',
            'description': 'Kan zich verbergen tegen aanvallen vanop afstand in dit terrein.',
            'icon': 'stealth',
            '__class__': 'BattleStealthAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'stealth_tank',
        '__class__': 'ArmyUnit'
      },
      {
        'currentHitpoints': 10,
        'abilities': [
          {
            'used_at_step': -1,
            'value': 'own',
            'type': 'rogue',
            'name': 'Geheime identiteit',
            'description': 'Negeert eerste schade en verandert in een eenheid van het eigen leger. Sterft in plaats daarvan als er geen eenheid zonder geheime identiteit meer is.',
            'icon': 'rogue',
            '__class__': 'BattleRogueAbility'
          }
        ],
        'bonuses': [

        ],
        'entity_id': -1,
        'unitTypeId': 'rogue',
        '__class__': 'ArmyUnit'
      }
    ],
    'is_defending': true,
    '__class__': 'ClanBattleArmy'
  }
]
clanBattle.process('getProvinceSectorDetailed', { defending_armies: data })

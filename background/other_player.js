otherPlayer = {
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'visitPlayer':
        results = otherPlayer.processEntities(data.city_map.entities);
        console.log('rewards', results);

        // Show full rewards, not only max!
        suppliesMax = { value: 0 };
        moneyMax = { value: 0 };
        spMax = { value: 0 };
        medalsMax = { value: 0 };
        clanPowerMax = { value: 0 };
        goods = [];
        for (var i = 0; i < results.length; i++) {
          result = results[i];
          if (result.product !== undefined && result.product.resources !== undefined && result.type != 'random_production') {
            goodsValue = consts.valueGoods(result.product.resources);
            if (goodsValue > 0) {
              goods.push({
                amount: consts.amountGoods(result.product.resources),
                name: result.id,
                all: copyProductResources(result),
                value: goodsValue,
                raw: result.product.resources
              });
            }
            if (result.product.resources.money > moneyMax.value) {
              moneyMax = { value: result.product.resources.money, name: result.id, all: copyProductResources(result)};
            }
            if (result.product.resources.supplies > suppliesMax.value) {
              suppliesMax = { value: result.product.resources.supplies, name: result.id, all: copyProductResources(result)};
            }
            if (result.product.resources.medals > medalsMax.value) {
              medalsMax = { value: result.product.resources.medals, name: result.id, all: copyProductResources(result)};
            }
            if (result.product.resources.strategy_points && otherPlayer.spMoreValuable(result.product.resources, spMax)) {
              spMax = { value: result.product.resources.strategy_points, name: result.id, all: copyProductResources(result)};
            }
          } else {
            if (debug) {
              console.warn('no-revenue', result);
            }
          }
          if (result.clan_power && result.clan_power > clanPowerMax.value) {
            clanPowerMax = { value: result.clan_power, name: result.id, all: copyProductResources(result)};
          }
        }
        if (spMax.value > 0) {
          console.log('sp', spMax);
        }
        if (goods.length > 0) {
          goods = sortByKeyDesc(goods, 'value');
          console.log('goods', goods);
        }
        if (moneyMax.value > 0) {
          console.log('money', moneyMax);
        }
        if (suppliesMax.value > 0) {
          console.log('supplies', suppliesMax);
        }
        if (medalsMax.value > 0) {
          console.log('medals', medalsMax);
        }
        if (clanPowerMax.value > 0) {
          console.log('clan power', clanPowerMax);
        }
        sendMessageCache({ 'revenue': {
          spMax: spMax,
          goods: goods,
          moneyMax: moneyMax,
          suppliesMax: suppliesMax,
          medalsMax: medalsMax,
          clanPowerMax: clanPowerMax
        }});

        // Provide battle information of this player
        sendPlayerArmies(data.other_player.player_id);
        break;
      default:
        if (trace || debug) {
          console.log('otherPlayer.' + method + ' is not used');
        }
    }
  },
  processEntities: function (entities) {
    result = [];
    for (var i = 0; i < entities.length; i++) {
      entity = entities[i];
      try {
        // TODO Figure out if available, or producing
        switch (entity.type) {
          case 'production':
          case 'goods':
          case 'random_production':
          case 'residential':
            if (entity.state.boosted !== true && entity.state.current_product !== undefined && entity.state.__class__ === 'ProductionFinishedState') {
              age = consts.getAge(entity.cityentity_id.split('_')[1]);
              result.push({
                age: age,
                id: entity.cityentity_id,
                type: entity.type,
                state: entity.state.__class__,
                product: entity.state.current_product.product,
                clan_power: entity.state.current_product.clan_power,
                full_info: entity
              });
            }
            break;
        }
      } catch (e) {
        console.log('Failed to process entity', e);
        console.log(entity);
      }
    }

    return result;
  },
  spMoreValuable: function (newRevenue, currentRevenue) {
    if (newRevenue.strategy_points != currentRevenue.value) {
      return newRevenue.strategy_points > currentRevenue.value;
    }

    // Compare goods value
    newGoodsValue = consts.valueGoods(newRevenue);
    currentGoodsValue = consts.valueGoods(currentRevenue);
    if (newGoodsValue < currentGoodsValue) {
      return false;
    }

    // Compare Money and Supplies
    newMSValue = (newRevenue.money || 0) + (newRevenue.supplies || 0);
    currentMSValue = currentRevenue.all ? (currentRevenue.all.money || 0) + (currentRevenue.all.supplies || 0) : 0;

    return newMSValue > currentMSValue;
  }
};

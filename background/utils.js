function humanReadableTime (seconds) {
  var hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  var minutes = '0' + Math.floor(seconds / 60);
  seconds -= minutes * 60;
  seconds = '0' + Math.floor(seconds);
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function sortByKey (array, key) {
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i][key] < array[j][key]) {
        [ array[i], array[j] ] = [ array[j], array[i] ];
      }
    }
  }
  return array;
}

function copyRevenue (result) {
  revenue = {};

  if (result.revenue) {
    if (result.revenue.goods !== undefined && result.revenue.goods.length > 0) {
      revenue['goods'] = result.revenue.goods;
    }
    if (result.revenue.money) {
      revenue['money'] = result.revenue.money;
    }
    if (result.revenue.supplies) {
      revenue['supplies'] = result.revenue.supplies;
    }
    if (result.revenue.strategy_points && result.revenue.strategy_points.currentSP) {
      revenue['sp'] = result.revenue.strategy_points.currentSP;
    }
    if (result.revenue.medals) {
      revenue['medals'] = result.revenue.medals;
    }
  }
  if (entity.state.current_product && result.current_product.clan_power) {
    revenue['clan_power'] = entity.state.current_product.clan_power;
  }
  if (Object.keys(revenue).length > 1) {
    return revenue;
  }

  return undefined;
}

var createRingBuffer = function (length) {
  var pointer = 0, buffer = [];

  return {
    get: function (key) { return buffer[key]; },
    push: function (item) {
      buffer[pointer] = item;
      pointer = (length + pointer + 1) % length;
    },
    length: length
  };
};

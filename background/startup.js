startup = {
  playerId: 0,
  process: function (method, data) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'getData':
        startup.setPlayerId(data.user_data.player_id);
        greatBuilding.checkArcBonus(data.city_map.entities);

        var goods = {};
        var goodsList = data.goodsList;
        for (var i = 0; i < goodsList.length; i++) {
          goods[goodsList[i].id] = goodsList[i].era;
        }
        startup.setGoods(goods);

        break;
      default:
        if (trace || debug) {
          console.log('startupService.' + method + ' is not used');
        }
    }
  },
  setPlayerId: function (playerId) {
    if (debug) {
      console.log('playerId', playerId);
    }
    localSet({ 'playerId': playerId });
    startup.playerId = playerId;
  },
  setGoods: function (goods) {
    if (debug) {
      console.log(Object.keys(goods).length + ' goods registered');
    }
    localSet({ 'goods': goods });
    consts.goods = goods;
    sendNotification('goods', '', '');
  }
};

listenToWorldIDChanged(function () {
  localGet({ 'goods': false, playerId: false }, function (result) {
    if (!result.goods) {
      sendNotification('goods', 'error', 'Goods not available, restart/refresh game');
    } else {
      startup.setGoods(result.goods);
    }
    if (result.playerId) {
      startup.playerId = result.playerId;
    }
  });
});

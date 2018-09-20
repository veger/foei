cityMap = {
  process: function (method, data, id) {
    if (trace) {
      console.log(data);
    }
    switch (method) {
      case 'updateEntity':
        greatBuilding.storeBuildingInfo(id, data[0].state.forge_points_for_level_up);
        break;
      default:
        if (trace || debug) {
          console.log(method + ' is not used');
        }
    }
  }
};

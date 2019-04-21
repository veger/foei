resource = {
    resources: {},
    process: function (method, data) {
        if (trace) {
            console.log('ResourceService.' + method, data);
        }
        switch (method) {
            case 'getPlayerResources':
                startup.getGoods(function (goods) {
                    if (goods === undefined) {
                        // There are really not goods yet... We'll come back later
                        return
                    }
                    worldGoods = {}
                    for (good of Object.getOwnPropertyNames(goods)) {
                        if (data.resources[good] > 0) {
                            worldGoods[good] = data.resources[good]
                        }
                    }
                    if (debug) {
                        console.log("Player has " + consts.amountGoods(worldGoods) + " resources in stock")
                    }
                    resource.resources[worldID] = worldGoods
                })
                break;
            default:
                if (trace || debug) {
                    console.log('ResourceService.' + method + ' is not used');
                }
        }
    }
}

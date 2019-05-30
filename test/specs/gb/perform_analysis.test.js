const assert = require('chai').assert

includeJavascript('background/great_buildings.js')
includeJavascript('background/utils.js')

describe('performAnalysis', function () {
  it('should have basics its result', function () {
    const totalFP = 200
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 100, reward: { blueprints: 5, strategy_point_amount: 50, resources: { medals: 500 } } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, forge_points: 50, reward: { blueprints: 4, strategy_point_amount: 40, resources: { medals: 400 } } },
      { player: { is_self: false, player_id: 'owner' }, forge_points: 20 },
      { rank: 3, player: { is_self: false, player_id: 'p3' }, forge_points: 15, reward: { blueprints: 3, strategy_point_amount: 30, resources: { medals: 300 } } },
      { rank: 4, player: { is_self: false, player_id: 'p4' }, forge_points: 3, reward: { blueprints: 2, strategy_point_amount: 20, resources: { medals: 200 } } },
      { rank: 5, player: { }, reward: { blueprints: 2, strategy_point_amount: 20, resources: { medals: 200 } } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    assert.equal(result.totalFP, totalFP)
    assert.isDefined(result.freeFP)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    // All investments (except owner) should be in results
    assert.equal(aResult[0].invested, 100, 'rank 1 invested SP')
    assert.equal(aResult[1].invested, 50, 'rank 2 invested SP')
    assert.equal(aResult[2].invested, 15, 'rank 3 invested SP')
    assert.equal(aResult[3].invested, 3, 'rank 4 invested SP')
    assert.isUndefined(aResult[4].invested, "rank 5 doesn't have investment")

    // All rewards should be filled
    assert.deepEqual(aResult[0].reward, { fp: rankings[0].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[0].reward.blueprints, blueprintsBonus: 0, medals: rankings[0].reward.resources.medals, medalsBonus: 0 }, 'rank 1 reward')
    assert.deepEqual(aResult[1].reward, { fp: rankings[1].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[1].reward.blueprints, blueprintsBonus: 0, medals: rankings[1].reward.resources.medals, medalsBonus: 0 }, 'rank 2 reward')
    assert.deepEqual(aResult[2].reward, { fp: rankings[3].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[3].reward.blueprints, blueprintsBonus: 0, medals: rankings[3].reward.resources.medals, medalsBonus: 0 }, 'rank 3 reward')
    assert.deepEqual(aResult[3].reward, { fp: rankings[4].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[4].reward.blueprints, blueprintsBonus: 0, medals: rankings[4].reward.resources.medals, medalsBonus: 0 }, 'rank 4 reward')
    assert.deepEqual(aResult[4].reward, { fp: rankings[5].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[5].reward.blueprints, blueprintsBonus: 0, medals: rankings[5].reward.resources.medals, medalsBonus: 0 }, 'rank 5 reward')
  })
})

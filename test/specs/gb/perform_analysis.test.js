const assert = require('chai').assert

describe('performAnalysis', function () {
  beforeEach(function () {
    greatBuilding.arcBonus = 0
    startup.playerId = 'self'
  })

  it('should have proper basics in its result', function () {
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
    assert.isFalse(result.selfOwner)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    // All investments (except owner) should be in results
    assert.equal(aResult[0].invested, 100, 'rank 1 invested SP')
    assert.equal(aResult[1].invested, 50, 'rank 2 invested SP')
    assert.equal(aResult[2].invested, 15, 'rank 3 invested SP') // actual 20 -> owner is not filtered
    assert.equal(aResult[3].invested, 3, 'rank 4 invested SP')
    assert.isUndefined(aResult[4].invested, "rank 5 doesn't have investment")

    // All rewards should be filled
    assert.deepEqual(aResult[0].reward, { fp: rankings[0].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[0].reward.blueprints, blueprintsBonus: 0, medals: rankings[0].reward.resources.medals, medalsBonus: 0 }, 'rank 1 reward')
    assert.deepEqual(aResult[1].reward, { fp: rankings[1].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[1].reward.blueprints, blueprintsBonus: 0, medals: rankings[1].reward.resources.medals, medalsBonus: 0 }, 'rank 2 reward')
    assert.deepEqual(aResult[2].reward, { fp: rankings[3].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[3].reward.blueprints, blueprintsBonus: 0, medals: rankings[3].reward.resources.medals, medalsBonus: 0 }, 'rank 3 reward')
    assert.deepEqual(aResult[3].reward, { fp: rankings[4].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[4].reward.blueprints, blueprintsBonus: 0, medals: rankings[4].reward.resources.medals, medalsBonus: 0 }, 'rank 4 reward')
    assert.deepEqual(aResult[4].reward, { fp: rankings[5].reward.strategy_point_amount, fpBonus: 0, blueprints: rankings[5].reward.blueprints, blueprintsBonus: 0, medals: rankings[5].reward.resources.medals, medalsBonus: 0 }, 'rank 5 reward')
  })

  it('should have proper basics in its result (self not owner) (Inno lvl 38)', function () {
    const totalFP = 1757
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 700, reward: { strategy_point_amount: 510, resources: {} } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, forge_points: 400, reward: { strategy_point_amount: 255, resources: {} } },
      { rank: 3, player: { is_self: true, player_id: 'self' }, forge_points: 150, reward: { strategy_point_amount: 85, resources: {} } },
      { player: { is_self: false, player_id: 'owner' }, forge_points: 7 },
      { rank: 4, player: { }, reward: { strategy_point_amount: 20, resources: {} } },
      { rank: 5, player: { }, reward: { strategy_point_amount: 5, resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    // All investments (except owner) should be in results
    assert.equal(aResult[0].invested, 700, 'rank 1 invested SP')
    assert.equal(aResult[1].invested, 400, 'rank 2 invested SP')
    assert.equal(aResult[2].invested, 150, 'rank 3 invested SP') // actual 7 -> owner is not filtered
    assert.isUndefined(aResult[3].invested, 'rank 4 did not invest yet')
    assert.isUndefined(aResult[4].invested, 'rank 5 did not invest yet')

    // All rewards should be filled
    assert.isDefined(aResult[0].reward)
    assert.isDefined(aResult[1].reward)
    assert.isDefined(aResult[2].reward)
    assert.isDefined(aResult[3].reward)
    assert.isDefined(aResult[4].reward)
  })

  it('should have proper basics in its result (self-owner) (Arc lvl 61)', function () {
    const totalFP = 3418
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 100, reward: { blueprints: 12, strategy_point_amount: 990, resources: { medals: 25164 } } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, forge_points: 50, reward: { blueprints: 9, strategy_point_amount: 495, resources: { medals: 12582 } } },
      { player: { is_self: true, player_id: 'owner' }, forge_points: 25 },
      { rank: 3, player: { }, reward: { blueprints: 7, strategy_point_amount: 165, resources: { medals: 6291 } } },
      { rank: 4, player: { }, reward: { blueprints: 6, strategy_point_amount: 40, resources: { medals: 2516 } } },
      { rank: 5, player: { }, reward: { blueprints: 5, strategy_point_amount: 10, resources: { medals: 1258 } } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    startup.setPlayerId('owner')
    const result = greatBuilding.performAnalysis(rankings)

    assert.equal(result.totalFP, totalFP)
    assert.isDefined(result.freeFP)
    assert.isTrue(result.selfOwner)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    // All investments (except owner) should be in results
    assert.equal(aResult[0].invested, 100, 'rank 1 invested SP')
    assert.equal(aResult[1].invested, 50, 'rank 2 invested SP')
    assert.isUndefined(aResult[2].invested, 'rank 3 did not invest yet')
    assert.isUndefined(aResult[3].invested, 'rank 4 did not invest yet')
    assert.isUndefined(aResult[4].invested, 'rank 5 did not invest yet')

    // All rewards should be filled
    assert.isDefined(aResult[0].reward)
    assert.isDefined(aResult[1].reward)
    assert.isDefined(aResult[2].reward)
    assert.isDefined(aResult[3].reward)
    assert.isDefined(aResult[4].reward)
  })

  it('should have Arc bonus filled in', function () {
    const totalFP = 200
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 100, reward: { blueprints: 5, strategy_point_amount: 100, resources: { medals: 500 } } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, forge_points: 33, reward: { blueprints: 1, resources: { medals: 123 } } }
    ]

    greatBuilding.setArcBonus(40)
    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 2, '2 ranks with results should be in result')

    // All rewards should be filled in
    assert.equal(aResult[0].reward.fpBonus, 40)
    assert.equal(aResult[0].reward.blueprintsBonus, 2)
    assert.equal(aResult[0].reward.medalsBonus, 200)
    assert.isNaN(aResult[1].reward.fpBonus)
    assert.equal(aResult[1].reward.blueprintsBonus, 0)
    assert.equal(aResult[1].reward.medalsBonus, 49)
  })

  it('should be able to calculate profit', function () {
    const totalFP = 40
    const rankings = [
      { rank: 1, player: { is_self: false }, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { is_self: false }, reward: { strategy_point_amount: 0, resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 2, '2 ranks with results should be in result')

    assert.equal(aResult[0].profit, rankings[0].reward.strategy_point_amount - aResult[0].spotSafe)
    assert.equal(aResult[1].profit, rankings[1].reward.strategy_point_amount - aResult[1].spotSafe)

    greatBuilding.setArcBonus(56)
    const resultBonus = greatBuilding.performAnalysis(rankings)

    const aResultBonus = resultBonus.analysis
    assert.lengthOf(aResultBonus, 2, '2 ranks with results should be in result')

    assert.equal(aResultBonus[0].profit, 16 - aResultBonus[0].spotSafe)
    assert.equal(aResultBonus[1].profit, 0 - aResultBonus[1].spotSafe)
  })

  it('should be able to handle lots of investers', function () {
    const totalFP = 200
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 100, reward: { blueprints: 5, strategy_point_amount: 50, resources: { medals: 500 } } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, forge_points: 50, reward: { blueprints: 4, strategy_point_amount: 40, resources: { medals: 400 } } },
      { rank: 3, player: { is_self: false, player_id: 'p3' }, forge_points: 15, reward: { blueprints: 3, strategy_point_amount: 30, resources: { medals: 300 } } },
      { rank: 4, player: { is_self: false, player_id: 'p4' }, forge_points: 5, reward: { blueprints: 2, strategy_point_amount: 20, resources: { medals: 200 } } },
      { rank: 5, player: { is_self: false, player_id: 'p5' }, forge_points: 4, reward: { blueprints: 2, strategy_point_amount: 20, resources: { medals: 200 } } },
      { rank: 6, player: { is_self: false, player_id: 'p6' }, forge_points: 3 },
      { rank: 7, player: { is_self: false, player_id: 'p7' }, forge_points: 2 },
      { rank: 8, player: { is_self: false, player_id: 'p8' }, forge_points: 1 }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 8, '8 ranks should be in results')

    assert.isDefined(aResult[0].spotSafe)
    assert.isDefined(aResult[1].spotSafe)
    assert.isDefined(aResult[2].spotSafe)
    assert.isDefined(aResult[3].spotSafe)
    assert.isDefined(aResult[4].spotSafe)
    assert.isUndefined(aResult[5].spotSafe) // Only first 5 ranks should have calculations
    assert.isUndefined(aResult[6].spotSafe)
    assert.isUndefined(aResult[7].spotSafe)
  })

  it('should be able to calculate empty GB (Delphi lvl 1)', function () {
    const totalFP = 40
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { is_self: false, player_id: 'p2' }, reward: { strategy_point_amount: 5, resources: {} } },
      { rank: 3, player: { }, reward: { resources: {} } },
      { rank: 4, player: { }, reward: { resources: {} } },
      { rank: 5, player: { }, reward: { resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, 20) // half of totalFP (first one donating will have the spot)
    assert.equal(aResult[1].spotSafe, 13) // third of (totalFP - 1) -> one player must have more than you
    assert.equal(aResult[2].spotSafe, 10) // fourth of (totalFP - 2) -> two players must have more than you
    assert.equal(aResult[3].spotSafe, 8) // etc.
    assert.equal(aResult[4].spotSafe, 6)
  })

  it('should be able to calculate GB with owner donation (Delphi lvl 1)', function () {
    const totalFP = 40
    const rankings = [
      { player: { player_id: 'owner' }, forge_points: 10 },
      { rank: 1, player: { player_id: 'p1' }, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { player_id: 'p2' }, reward: { strategy_point_amount: 5, resources: {} } },
      { rank: 3, player: { }, reward: { resources: {} } },
      { rank: 4, player: { }, reward: { resources: {} } },
      { rank: 5, player: { }, reward: { resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, 15) // half of totalFP - investment (as we don't care about owner)
    assert.equal(aResult[1].spotSafe, 10) // third of (totalFP - I - 1)
    assert.equal(aResult[2].spotSafe, 7) // fourth of (totalFP - I - 2)
    assert.equal(aResult[3].spotSafe, 6) // etc.
    assert.equal(aResult[4].spotSafe, 5)
  })

  it('should be able to calculate GB with p1 invested (unsafe) (Delphi lvl 1)', function () {
    const totalFP = 40
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 10, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { }, reward: { strategy_point_amount: 5, resources: {} } },
      { rank: 3, player: { }, reward: { resources: {} } },
      { rank: 4, player: { }, reward: { resources: {} } },
      { rank: 5, player: { }, reward: { resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, 20) // half of (totalFP - investment * 2) + investment (player need to invest same and then do half of remaining)
    assert.equal(aResult[1].spotSafe, 13) // third of (totalFP - I * 3 - 1) + investment
    assert.equal(aResult[2].spotSafe, 10) // cannot pass player (totalFP - I * 4 - 2) < 0, so don't care about p1: third of (totalFP - I - 1) -> one player (rank 2) must have more than you
    assert.equal(aResult[3].spotSafe, 7) // fourth of (totalFP - I - 2) -> 2 players (rank 2 & 3) must have more than you
    assert.equal(aResult[4].spotSafe, 6) // fifth of (totalFP - I - 3) -> 3 players must have more than you
  })

  it('should be able to calculate GB with p1 invested (exactly safe) (Delphi lvl 1)', function () {
    const totalFP = 40
    const rankings = [
      { rank: 1, player: { is_self: false, player_id: 'p1' }, forge_points: 20, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { }, reward: { strategy_point_amount: 5, resources: {} } },
      { rank: 3, player: { }, reward: { resources: {} } },
      { rank: 4, player: { }, reward: { resources: {} } },
      { rank: 5, player: { }, reward: { resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, false) // cannot secure this spot anymore
    assert.equal(aResult[1].spotSafe, 10) // cannot pass p1: half of (totalFP - I)
    assert.equal(aResult[2].spotSafe, 7) // etc.
    assert.equal(aResult[3].spotSafe, 5)
    assert.equal(aResult[4].spotSafe, 4)
  })

  it('should be able to calculate GB with self invested (Delphi lvl 1)', function () {
    const totalFP = 40
    const rankings = [
      { rank: 1, player: { is_self: true, player_id: 'p1' }, forge_points: 10, reward: { strategy_point_amount: 10, resources: {} } },
      { rank: 2, player: { }, reward: { strategy_point_amount: 5, resources: {} } },
      { rank: 3, player: { }, reward: { resources: {} } },
      { rank: 4, player: { }, reward: { resources: {} } },
      { rank: 5, player: { }, reward: { resources: {} } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, 20) // own investment doesn't matter, so half of totalFP
    assert.equal(aResult[1].spotSafe, 13)
    assert.equal(aResult[2].spotSafe, 10)
    assert.equal(aResult[3].spotSafe, false) // already invested more than required to be safe
    assert.equal(aResult[4].spotSafe, false)
  })

  it('should work when self (safe) is followed by owner (Arc lvl 35)', function () {
    const totalFP = 1844
    const rankings = [
      { rank: 1, player: { player_id: 'p1' }, forge_points: 980, reward: { blueprints: 8, strategy_point_amount: 525, resources: { medals: 13270 } } },
      { rank: 2, player: { player_id: 'p2' }, forge_points: 499, reward: { blueprints: 6, strategy_point_amount: 265, resources: { medals: 6635 } } },
      { rank: 3, player: { is_self: true, player_id: 'p3' }, forge_points: 164, reward: { blueprints: 5, strategy_point_amount: 90, resources: { medals: 3318 } } },
      { player: { player_id: 'owner' }, 'forge_points': 60 },
      { rank: 4, player: {}, reward: { blueprints: 4, strategy_point_amount: 25, resources: { medals: 1327 } } },
      { rank: 5, player: {}, reward: { blueprints: 3, strategy_point_amount: 5, resources: { medals: 664 } } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    // All spots are safe (or uninteresting to self)
    assert.equal(aResult[0].spotSafe, false)
    assert.equal(aResult[1].spotSafe, false)
    assert.equal(aResult[2].spotSafe, false)
    assert.equal(aResult[3].spotSafe, false)
    assert.equal(aResult[4].spotSafe, false)
  })

  it('should work when self (unsafe) is followed by owner (Arc lvl 68)', function () {
    const totalFP = 4164
    const rankings = [
      { rank: 1, player: { player_id: 'p1' }, forge_points: 2002, reward: { blueprints: 14, strategy_point_amount: 1150, resources: { medals: 29214 } } },
      { rank: 2, player: { is_self: true, player_id: 'p2' }, forge_points: 707, reward: { blueprints: 10, strategy_point_amount: 575, resources: { medals: 14607 } } },
      { player: { player_id: 'owner' }, forge_points: 199 },
      { rank: 3, player: { player_id: 'p3' }, forge_points: 100, reward: { blueprints: 8, strategy_point_amount: 190, resources: { medals: 7304 } } },
      { rank: 4, player: { player_id: 'p4' }, forge_points: 10, reward: { blueprints: 6, strategy_point_amount: 50, resources: { medals: 2921 } } },
      { rank: 5, player: { }, reward: { blueprints: 5, strategy_point_amount: 10, resources: { medals: 1461 } } }
    ]

    greatBuilding.storeBuildingInfo(0, 'owner', totalFP)
    const result = greatBuilding.performAnalysis(rankings)

    const aResult = result.analysis
    assert.lengthOf(aResult, 5, '5 ranks with results should be in result')

    assert.equal(aResult[0].spotSafe, false)
    assert.equal(aResult[1].spotSafe, 977)
    assert.equal(aResult[2].spotSafe, false)
    assert.equal(aResult[3].spotSafe, false)
    assert.equal(aResult[4].spotSafe, false)
  })
})

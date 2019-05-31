const assert = require('chai').assert
const sinon = require('sinon')

describe('process', function () {
  beforeEach(function () {
    sinon.spy(greatBuilding, 'checkArcBonus')
    startup.playerId = 'self'
  })

  afterEach(function () {
    greatBuilding.checkArcBonus.restore()
  })

  it('should update GB info for owned buildings', function () {
    cityMap.process('updateEntity', [{ player_id: 'self', state: {} }])

    assert.isTrue(greatBuilding.checkArcBonus.calledOnce, 'updating own GB should check Arc bonus')
  })

  it('should not update GB info for non-owned buildings', function () {
    cityMap.process('updateEntity', [{ player_id: 'other', state: {} }])

    assert.isFalse(greatBuilding.checkArcBonus.calledOnce, "updating non-owned GB should not trigger checking the Arc bonus, as it is not 'self bonus'")
  })
})

const assert = require('chai').assert

describe('metadata', function () {
  beforeEach(function () {
    staticData._data = {}
  })

  it('should store worldIds in correct hash', function () {
    staticData.registerWorldHash('us1', 'test_type', 'my_hash')
    staticData.registerWorldHash('us1', 'other_type', 'my_hash2')

    assert.deepEqual(staticData._data, {
      us: {
        test_type: {
          my_hash: {
            worlds: [ 'us1' ],
            data: []
          }
        },
        other_type: {
          my_hash2: {
            worlds: [ 'us1' ],
            data: []
          }
        }
      }
    })
  })

  it('should move worldId to new hash', function () {
    staticData.registerWorldHash('us1', 'test_type', 'my_hash')
    staticData.registerWorldHash('us1', 'test_type', 'my_hash2')

    assert.deepEqual(staticData._data, {
      us: {
        test_type: {
          my_hash2: {
            worlds: [ 'us1' ],
            data: []
          }
        }
      }
    })
  })

  it('should store and retrieve data in known hash', function () {
    staticData.registerWorldHash('us1', 'test_type', 'my_hash')
    staticData.setData('us', 'test_type', 'my_hash', function () {
      return 'data-stored'
    })

    setWorldID('us1')
    assert.equal(staticData.getData('test_type', 'my_hash'), 'data-stored')
  })

  it('should not store and retrieve data in unknown hash', function () {
    staticData.registerWorldHash('us1', 'test_type', 'my_hash')
    staticData.setData('us', 'wrong_type', 'my_hash', function () {
      assert.fail()
    })

    setWorldID('us1')
    assert.isNull(staticData.getData('my_hash', 'my_hash'))
  })

  it('should not store same hash twice', function () {
    staticData.registerWorldHash('us1', 'test_type', 'my_hash')
    staticData.setData('us', 'test_type', 'my_hash', function () {
      return 'stored-data'
    })
    staticData.setData('us', 'test_type', 'my_hash', function () {
      assert.fail()
    })

    setWorldID('us1')
    assert.equal(staticData.getData('test_type', 'my_hash'), 'stored-data')
  })
})

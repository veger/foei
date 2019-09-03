const assert = require('chai').assert

describe('checkRelease', function () {
  it('should have own and latest release version', function () {
    assert.equal(msgCache.version.own, '4.2.0')
    assert.equal(msgCache.version.latest, '4.2.0')
  })

  it("should handle release version without 'v'", async function () {
    global.releaseVersion = '1.2.3'
    await startup.checkRelease()

    assert.equal(msgCache.version.latest, '1.2.3')
  })
})

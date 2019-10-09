const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
const chrome = require('sinon-chrome')
const fs = require('fs')
const vm = require('vm')

sinonStubPromise(sinon)

global.listenToWorldIDChanged = sinon.stub()

global.chrome = chrome

// Stub fetch API (startup.js needs it)
global.releaseVersion = 'v4.2.0'
global.fetch = function () {}
sinon.stub(global, 'fetch')
global.fetch.returns(Promise.resolve(mockApiResponse()))
function mockApiResponse () {
  return {
    status: 200,
    headers: { 'Content-type': 'application/json' },
    json: function () {
      return Promise.resolve({
        name: global.releaseVersion
      })
    }
  }
}

// let chrome.runtime.getManifest return required (by startup.js) fields
chrome.runtime.getManifest.returns({ version: '4.2.0' })

// Trick to load Javascript files that are not modules
function includeJavascript (path) {
  var code = fs.readFileSync(path, 'utf-8')
  vm.runInThisContext(code, path)
}

global.debug = false
global.trace = false

includeJavascript('background/consts.js')
includeJavascript('background/storage.js')
includeJavascript('background/utils.js')
includeJavascript('background/resource.js')
includeJavascript('background/startup.js')
includeJavascript('background/great_buildings.js')
includeJavascript('background/city_map.js')
includeJavascript('background/static_data.js')

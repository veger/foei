const sinon = require('sinon')
const chrome = require('sinon-chrome')
const fs = require('fs')
const vm = require('vm')

global.listenToWorldIDChanged = sinon.stub()

global.chrome = chrome

// Trick to load Javascript files that are not modules
global.includeJavascript = function includeJavascript (path) {
  var code = fs.readFileSync(path, 'utf-8')
  vm.runInThisContext(code, path)
}

global.debug = false
global.trace = false

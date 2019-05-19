'use strict'

let debugButton = document.getElementById('debug')
let traceButton = document.getElementById('trace')

chrome.storage.local.get('_debug', function (data) {
  debugButton.checked = data._debug
})
chrome.storage.local.get('_trace', function (data) {
  traceButton.checked = data._trace
})

debugButton.onchange = function (element) {
  chrome.runtime.sendMessage({ 'debug': debugButton.checked })
}
traceButton.onchange = function (element) {
  chrome.runtime.sendMessage({ 'trace': traceButton.checked })
}

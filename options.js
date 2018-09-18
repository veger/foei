let debugButton = document.getElementById('debug');
let traceButton = document.getElementById('trace');

chrome.storage.sync.get('debug', function (data) {
  debugButton.checked = data.debug;
});
chrome.storage.sync.get('trace', function (data) {
  traceButton.checked = data.trace;
});

debugButton.onchange = function (element) {
  chrome.runtime.sendMessage({'debug': debugButton.checked});
};
traceButton.onchange = function (element) {
  chrome.runtime.sendMessage({'trace': traceButton.checked});
};

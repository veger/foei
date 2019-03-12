console.log('injecting ajax_inspect...');

var s = document.createElement('script');
s.src = chrome.extension.getURL('ajax_inspect.js');
s.onload = function () {
  s.parentNode.removeChild(s);
};
(document.head || document.documentElement).appendChild(s);

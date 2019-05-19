'use strict'

let s = document.createElement('script')
s.src = chrome.extension.getURL('ajax_inspect.js')
s.onload = function () {
  s.parentNode.removeChild(s)
};
(document.head || document.documentElement).appendChild(s)

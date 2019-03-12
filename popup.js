let updateCodeButton = document.getElementById('update_code');
let openUIButton = document.getElementById('open-ui');

updateCodeButton.onclick = function (element) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(
         tabs[0].id,
         {file: 'inject.js'});
  });
};

openUIButton.onclick = function (element) {
  chrome.tabs.create({ url: chrome.runtime.getURL('ui/ui.html') });
};

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.revenue) {
      updatePlunder(request.revenue);
    }
    if (request.rewards) {
      updateRewards(request.rewards);
    }
  }
);
chrome.extension.sendMessage({ 'resend_messages': true });

function humanReadableTime (seconds) {
  var hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  var minutes = '0' + Math.floor(seconds / 60);
  seconds -= minutes * 60;
  seconds = '0' + Math.floor(seconds);
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function secondsTime (humanReadable) {
  segments = humanReadable.split(':');
  return segments[0] * 3600 + segments[1] * 60 + segments[2] * 1;
}

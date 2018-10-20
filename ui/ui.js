chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.notifications) {
      updateNotifications(request.notifications);
    }
    if (request.worlds) {
      updateSettingsWorlds(request.worlds);
    }
    if (request.revenue) {
      updatePlunder(request.revenue);
    }
    if (request.rewards) {
      updateRewards(request.rewards);
    }
    if (request.battleStats) {
      updateBattleStats(request.battleStats);
    }
    if (request.gbFpAnalysis) {
      updateGreatBuildingAnalysis(request.gbFpAnalysis);
    }
    if (request.playerGBChanges) {
      updateGreatBuildingChanges(request.playerGBChanges);
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

function getNotificationBootstrapClass (type) {
  const notificationTypes2Bootstrap = {
    'info': 'info',
    'warning': 'warning',
    'error': 'danger'
  };
  return notificationTypes2Bootstrap[type] || 'danger';
}

function updateNotifications (notifications) {
  html = '';
  for (id in notifications) {
    html += '<div class="alert alert-' + getNotificationBootstrapClass(notifications[id].type) + '"">' + notifications[id].msg + '</div>';
  }
  $('#notifications').html(html);
}

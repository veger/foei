chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.revenue) {
        console.log('revenue', request.revenue);
      }
    }
  );

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.revenue) {
        updatePlunder(request.revenue);
      }
    }
  );

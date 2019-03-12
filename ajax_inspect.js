(function () {
  var DEBUG = false;

  var match = RegExp('extension:\\/\\/([^\\/]*)').exec(document.currentScript.src);
  var extensionID = match[1];

  var XHR = XMLHttpRequest.prototype;

  // Remember references to original methods
  var _open = XHR.open;
  var _send = XHR.send;

  // Collect data
  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    return _open.apply(this, arguments);
  };

  // Implement "ajaxSuccess" functionality
  XHR.send = function (postData) {
    this.addEventListener('load', function () {
      if (this._url.includes('asset')) {
        // Ignore asset requests
        return;
      }

      var formattedPostData = postData;
      if (postData instanceof ArrayBuffer) {
        formattedPostData = String.fromCharCode.apply(null, new Uint8Array(postData));
      }

      var response;
      switch (this.responseType) {
        case null:
          // no response data
          break;
        case '':
        case 'json':
        case 'text':
          response = this.responseText;
          break;
        case 'arraybuffer':
          response = String.fromCharCode.apply(null, this.response);
          break;
        default:
          console.log('received unsupported response type', this.responseType);
      }
      var jsonRequest;
      if (formattedPostData) {
        try {
          jsonRequest = JSON.parse(formattedPostData);
        } catch (_error) {
          console.log('Cannot convert json:', _error);
          console.log(formattedPostData);
        }
      }
      var jsonResponse;
      if (response) {
        try {
          jsonResponse = JSON.parse(response);
        } catch (_error) {
          console.log('Cannot convert json:', _error);
          console.log(response);
        }
      }
      if (jsonRequest || jsonResponse) {
        payload = { 'jsonRequest': jsonRequest, 'jsonResponse': jsonResponse };
        if (this._url.includes('forgeofempires.com')) {
          urlObj = new URL(this._url);
          payload.hostname = urlObj.hostname;
        }

        chrome.runtime.sendMessage(extensionID, payload);
      }
    });
    return _send.apply(this, arguments);
  };
})();

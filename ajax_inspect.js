console.log('injected ajax_inspect!');

(function () {
  var DEBUG = false;
  var extensionID = 'flpkgapjggmomnolpcifmgnlmjcgijae';
  var XHR = XMLHttpRequest.prototype;

  if (XHR._open === undefined) {
    // Remember references to original methods
    XHR._open = XHR.open;
    XHR._send = XHR.send;
  }

    // Overwrite native methods
    // Collect data:
  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    return XHR._open.apply(this, arguments);
  };

    // Implement "ajaxSuccess" functionality
  XHR.send = function (postData) {
    this.addEventListener('load', function () {
      if (this._url.includes('asset')) {
        // Ignore asset requests
        return;
      }
      if (DEBUG) {
        console.log('XHR.send', this._method, this._url, '->', this.responseType || '<no type>');
      }
      var formattedPostData = postData;
      if (postData instanceof ArrayBuffer) {
        formattedPostData = String.fromCharCode.apply(null, new Uint8Array(postData));
      }

      if (formattedPostData && DEBUG) {
        console.log(formattedPostData);
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
          console.log('unsupported type', this.responseType);
      }
      var jsonRequest;
      if (formattedPostData) {
        try {
          jsonRequest = JSON.parse(formattedPostData);
          if (DEBUG) {
            console.log(jsonRequest);
          }
        } catch (_error) {
          console.log('Cannot convert json:', _error);
          console.log(formattedPostData);
        }
      }
      var jsonResponse;
      if (response) {
        try {
          jsonResponse = JSON.parse(response);
          if (DEBUG) {
            console.log(jsonResponse);
          }
        } catch (_error) {
          console.log('Cannot convert json:', _error);
          console.log(response);
        }
      }
      if (formattedPostData || jsonResponse) {
        chrome.runtime.sendMessage(extensionID, {'jsonRequest': jsonRequest, 'jsonResponse': jsonResponse});
      }
    });
    return XHR._send.apply(this, arguments);
  };
})();

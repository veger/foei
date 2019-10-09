'use strict'

;(function () {
  let match = RegExp('extension:\\/\\/([^\\/]*)').exec(document.currentScript.src)
  let extensionID = match[1]

  let XHR = XMLHttpRequest.prototype

  // Remember references to original methods
  let _open = XHR.open
  let _send = XHR.send

  // Collect data
  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    return _open.apply(this, arguments)
  }

  // Implement "ajaxSuccess" functionality
  XHR.send = function (postData) {
    this.addEventListener('load', function () {
      if (this._url.includes('asset')) {
        // Ignore asset requests
        return
      }

      let formattedPostData = postData
      if (postData instanceof ArrayBuffer) {
        formattedPostData = String.fromCharCode.apply(null, new Uint8Array(postData))
      }

      let response
      switch (this.responseType) {
        case null:
          // no response data
          break
        case '':
        case 'json':
        case 'text':
          response = this.responseText
          break
        case 'arraybuffer':
          response = String.fromCharCode.apply(null, this.response)
          break
        default:
          console.log('received unsupported response type', this.responseType)
      }
      let jsonRequest
      if (formattedPostData) {
        try {
          jsonRequest = JSON.parse(formattedPostData)
        } catch (_error) {
          console.log('Cannot convert json:', _error)
          console.log(formattedPostData)
        }
      }
      let jsonResponse
      if (response) {
        try {
          jsonResponse = JSON.parse(response)
        } catch (_error) {
          console.log('Cannot convert json:', _error)
          console.log(response)
        }
      }
      if (jsonRequest || jsonResponse) {
        let payload = { jsonRequest: jsonRequest, jsonResponse: jsonResponse, metadata: {} }
        if (this._url.includes('forgeofempires.com')) {
          let urlObj = new URL(this._url)
          let match = RegExp('^[^\\.]*').exec(urlObj.hostname)
          payload.metadata.type = 'game'
          payload.metadata.world = match[0]
        } else if (this._url.includes('metadata')) {
          let match = RegExp('https://foe([^\\.]*).innogamescdn.com/start/metadata\\?id=([^-]*)-(.*)').exec(this._url)
          if (match !== null) {
            payload.metadata.type = 'meta'
            payload.metadata.lang = match[1]
            payload.metadata.id = match[2]
            payload.metadata.hash = match[3]
          }
        }

        chrome.runtime.sendMessage(extensionID, payload)
      }
    })
    return _send.apply(this, arguments)
  }
})()

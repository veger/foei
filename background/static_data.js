'use strict'

const worldRegex = RegExp(/([a-z]*)/)

const staticData = {
  _data: {},
  process: function (method, data) {
    if (trace) {
      console.log('StaticDataService.' + method, data)
    }
    switch (method) {
      case 'getMetadata':
        for (let index in data) {
          if (data[index].identifier === 'unit_types' || data[index].identifier === 'city_entities') {
            let match = RegExp('https://foe[^\\.]*.innogamescdn.com/start/metadata\\?id=([^-]*)-(.*)').exec(data[index].url)
            if (match === null) {
              console.log(`Could not find id and hash from url ${data[index].url}`)
            } else {
              this.registerWorldHash(worldID, match[1], match[2])
            }
          }
        }
        break
      default:
        if (trace || debug) {
          console.log('StaticDataService.' + method + ' is not used')
        }
    }
  },
  registerWorldHash: function (worldId, type, hash) {
    const lang = worldRegex.exec(worldId)[0]

    if (!this._data[lang]) {
      this._data[lang] = {}
    }
    if (!this._data[lang][type]) {
      this._data[lang][type] = { hashes: {}, worldHashes: {} }
    }
    if (!this._data[lang][type].hashes[hash]) {
      this._data[lang][type].hashes[hash] = { worlds: [], data: [] }
    }

    this._data[lang][type].worldHashes[worldId] = hash
    let index = this._data[lang][type].hashes[hash].worlds.indexOf(worldId)
    if (index > -1) {
      // Already registered, nothing to do
      return
    }

    // Remove old hash
    for (let [hashIndex, hash] of Object.entries(this._data[lang][type].hashes)) {
      let index = hash.worlds.indexOf(worldId)
      if (index > -1) {
        hash.worlds.splice(index, 1)
        if (hash.worlds.length === 0) {
          // Hash/data is not used anymore
          delete this._data[lang][type].hashes[hashIndex]
        }

        // No need to continue searching
        break
      }
    }

    // Store world in hash
    this._data[lang][type].hashes[hash].worlds.push(worldId)

    sendMessageCache({ 'staticData': this._data })
    localSet({ _metadata: this._data })
  },
  setData: function (lang, type, hash, dataFunc) {
    if (this._data[lang] && this._data[lang][type] && this._data[lang][type].hashes[hash] && this._data[lang][type].hashes[hash].data.length === 0) {
      this._data[lang][type].hashes[hash].data = dataFunc()
      sendMessageCache({ 'staticData': this._data })
      localSet({ _metadata: this._data })
    }
  },
  getData: function (type) {
    const lang = worldRegex.exec(worldID)[0]
    if (!(this._data[lang] && this._data[lang][type])) {
      return null
    }

    const hash = this._data[lang][type].worldHashes[worldID]
    if (hash && this._data[lang][type].hashes[hash]) {
      return this._data[lang][type].hashes[hash].data
    }
    return null
  }
}

localGet('_metadata', function (result) {
  if (result._metadata) {
    staticData._data = result._metadata
    sendMessageCache({ 'staticData': staticData._data })
  }
})

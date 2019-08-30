
const Plugin = require('@midgar/midgar/plugin')
const Cache = require('./libs/cache')

/**
 * MidgarCache plugin
 * 
 * Bind cache manager to midgar
 * @see 
 */
class MidgarCache extends Plugin {

  async init() {
    this._cache = new Cache(this.midgar)
    await this._cache.init()
    this.midgar.services.cache = this._cache
  }
}

module.exports = MidgarCache

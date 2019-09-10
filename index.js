const Plugin = require('@midgar/midgar/plugin')

/**
 * MidgarCache plugin
 * 
 * Bind cache manager to midgar
 * @see 
 */
class MidgarCache extends Plugin {
  async init() {
    this.pm.on('@midgar/services:afterInit', async () => {
      return this._afterServicesInit()
    })
  }

  /**
   * Init cache manager and cli
   */
  async _afterServicesInit() {
    if (this.midgar.cli) {
      await this._initCli()
    }
  }

  /**
   * Create cli
   */
  async _initCli() {
    const cacheService = await this.midgar.getService('@midgar/cache:cache')
    const CacheCli = require('./libs/cli')
    this.cli = new CacheCli(this.midgar, cacheService)
  }
}

module.exports = MidgarCache

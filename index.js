
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

    this.pm.on('afterMidgarInit', () => {
      return this._afterMidgarInit()
    })
  }

  /**
   * Init cache manager and cli
   */
  async _afterMidgarInit() {
    // Emit beforeInit event
    await this.midgar.pm.emit('@midgar/cache:beforeInit', { cache: this._cache })

    await this._cache.init()
    this.midgar.services.cache = this._cache
    
    await this.midgar.pm.emit('@midgar/cache:afterInit')

    if (this.midgar.services.cli) {
      await this._initCli()
    }
  }

  /**
   * Create cli
   */
  async _initCli() {
    const CacheCli = require('./libs/cli')
    this._cli = new CacheCli(this.midgar)
  }
}

module.exports = MidgarCache

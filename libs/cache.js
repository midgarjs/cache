const cacheManager = require('cache-manager');
const utils = require('@midgar/utils')

/**
 * Bind cache-manager module
 * @see https://www.npmjs.com/package/cache-manager
 */
class Cache {
  constructor(midgar) {
    this.midgar = midgar
  }

/**
 * Init cache manager
 */
  async init() {

    this.config = {
      store: 'memory',
 //     ttl: 10,/*seconds*/
    }

    if (this.midgar.config.cache) 
      Object.assign(this.config, this.midgar.config.cache)
    
    this._cache = await this._createCacheInstance(this.config.store)

    await this.clean()
  }

  async clean() {
    this.midgar.warn('Clean cache')
    const keys = await this._cache.keys()
    await utils.asyncMap(keys, async key => {
      await this.del(key)
    })
  }

  /**
   * 
   * @param {*} store 
   */
  async _createCacheInstance(store) {
    if (store == 'redis') {
      return this._createRedisCache()
    } else if (store == 'memory') {
      return cacheManager.caching({store: 'memory', max: 100, ttl: this.config.ttl});
    }
  }

  /**
   * 
   */
  _createRedisCache() {

    if (!this.config.host)
      throw new Error ('No host in cache config')

    const redisStore = require('cache-manager-redis-store');
    const opts = {
      store: redisStore,
      host: this.config.host, // default value
      ttl: this.config.ttl
    }

    if (this.config.port)
      opts.port = this.config.port

    if (this.config.auth_pass)
      opts.auth_pass = this.config.auth_pass

    if (this.config.db) 
      opts.db = this.config.db
    else 
      opts.db = 0
      
    return cacheManager.caching(opts);
  }

  set(key, value, opts = {}) {
    return new Promise((accept, reject) => {
      this._cache.set(key, value, opts, (err) => {
        if (err) {
          reject(err)
        }
        accept()
      })
    })
  }

  get(key) {
    return new Promise((accept, reject) => {
      this._cache.get(key, (err, result) => {
        if (err) {
          reject(err)
        }
        accept(result)
      })
    })
  }

  del(key) {
    return new Promise((accept, reject) => {
      this._cache.del(key, (err) => {
        if (err) {
          reject(err)
        }
        accept()
      })
    })
  }
}


module.exports = Cache
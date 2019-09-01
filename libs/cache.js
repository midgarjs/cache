const cacheManager = require('cache-manager')

const utils = require('@midgar/utils')

/**
 * Bind cache-manager module
 * @see https://www.npmjs.com/package/cache-manager
 */
class Cache {
  constructor(midgar) {
    this.midgar = midgar
    this._stores = []
    this.cacheManager = null
    this._storeInstances = {}
  }

/**
 * Init cache manager
 */
  async init() {
    this._config = this.midgar.config.cache || {}

    await this.createStoreInstance('default')
  }

  /**
   * 
   */
  async createStoreInstance(storeKey) {
    if (!this._config[storeKey] || !this._config[storeKey].store) {
      throw new Error('No store defined for ' + storeKey + ' cache.')
    }
    const store = this._config[storeKey].store
    const config = await this._getCreateStoreConfig(storeKey, store)
    this._storeInstances[storeKey] = cacheManager.caching(config);

    return this._storeInstances[storeKey]
  }

  getStoreInstance(storeKey = 'default') {
    return this._storeInstances[storeKey]
  }

  existStoreInstance(storeKey) {
    return this._storeInstances[storeKey] != undefined
  }

  /**
   * Return the session storage
   */
  async _getCreateStoreConfig(storeKey, store) {
    const storeCallback = await this.getStore(store)
    return await storeCallback(storeKey)
  }

  /**
   * Clean cache store
   * 
   * @param {*} storeKey 
   */
  async clean(storeKey) {
    const keys = await this.getStoreInstance(storeKey).keys()
    await utils.asyncMap(keys, async key => {
      await this.del(key, storeKey)
    })
  }

  /**
   * Clean all cache store
   */
  async cleanAll() {
    const keys = Object.keys(this._storeInstances)
    keys.forEach(storeKey => {
      this.clean(storeKey)
    })
  }

  set(key, value, opts = {}) {
    return new Promise((accept, reject) => {
      this.getStoreInstance().set(key, value, opts, (err) => {
        if (err) {
          reject(err)
        }
        accept()
      })
    })
  }

  get(key) {
    return new Promise((accept, reject) => {
      this.getStoreInstance().get(key, (err, result) => {
        if (err) {
          reject(err)
        }
        accept(result)
      })
    })
  }

  del(key, storeKey) {
    return new Promise((accept, reject) => {
      this.getStoreInstance(storeKey).del(key, (err) => {
        if (err) {
          reject(err)
        }
        accept()
      })
    })
  }

  /**
   * add a cache storage callback
   * @param {string} name storage name
   */
  async addStore(name, callback) {
    this._stores[name] = callback
  }

  /**
   * return a return storage callback
   * @param {string} name storage name
   */
  async getStore(name) {
    if (this._stores[name] !== undefined) {
      return this._stores[name]
    }

    throw new Error ('Invalid cache store name: ' + name)
  }
}


module.exports = Cache

const utils = require('@midgar/utils')

/**
 * CacheCli class
 * Add cli command to manage cache
 * 
 * commands: 
 *  - cache:clean
 *  - cache:cleanAll
 */
class CacheCli {
  constructor (midgar) {
    this.midgar = midgar
    
    if (!this.midgar.services.cli) {
      throw new Error('The cli service is not register')
    }

    this._cache = this.midgar.services.cache
    this._cli = this.midgar.services.cli

    //add cli commands
    this._addCommands()
  }

  _addCommands() {

    this._cli.command('cache:clean [storeKey]', 'Clean cache store', {}, async (argv) => {
      if (!argv.storeKey) {
        console.log('No cache store given !')
      } else if (!this._cache.existStoreInstance(argv.storeKey)) {
        console.log('Invalid cache store !')
      } else {
        await this._cache.clean(argv.storeKey)
      }
      process.exit(0)
    })

    this._cli.command('cache:cleanAll', 'Clean all cache instance', {}, async (argv) => {
      await this._cache.cleanAll()
      process.exit(0)
    })

  }
}

module.exports = CacheCli

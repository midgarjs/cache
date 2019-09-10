
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
  constructor (midgar, cacheService) {
    this.midgar = midgar
    
    if (!this.midgar.cli) {
      throw new Error('The cli is not register')
    }

    this.cacheService = cacheService
    this.cli = this.midgar.cli

    // Add cli commands
    this._addCommands()
  }

  /**
   * Add the cli commands to yargs
   */
  _addCommands() {
    this.cli.command('cache:clean [storeKey]', 'Clean cache store', {}, async (argv) => {
      if (!argv.storeKey) {
        console.log('No cache store given !')
      } else if (!this.cacheService.existStoreInstance(argv.storeKey)) {
        console.log('Invalid cache store !')
      } else {
        await this.cacheService.clean(argv.storeKey)
      }
      process.exit(0)
    })

    this.cli.command('cache:cleanAll', 'Clean all cache instance', {}, async (argv) => {
      await this.cacheService.cleanAll()
      process.exit(0)
    })

  }
}

module.exports = CacheCli

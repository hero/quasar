const fs = require('node:fs')
const fse = require('fs-extra')

const appPaths = require('../app-paths.js')
const { log, warn } = require('../utils/logger.js')
const { hasTypescript } = require('../utils/has-typescript.js')

module.exports.QuasarMode = class QuasarMode {
  get isInstalled () {
    return fs.existsSync(appPaths.ssrDir)
  }

  add () {
    if (this.isInstalled) {
      warn('SSR support detected already. Aborting.')
      return
    }

    log('Creating SSR source folder...')

    const format = hasTypescript ? 'ts' : 'default'
    fse.copySync(
      appPaths.resolve.cli(`templates/ssr/${ format }`),
      appPaths.ssrDir
    )

    fse.copySync(
      appPaths.resolve.cli('templates/ssr/ssr-flag.d.ts'),
      appPaths.resolve.ssr('ssr-flag.d.ts')
    )

    log('SSR support was added')
  }

  remove () {
    if (!this.isInstalled) {
      warn('No SSR support detected. Aborting.')
      return
    }

    log('Removing SSR source folder')
    fse.removeSync(appPaths.ssrDir)
    log('SSR support was removed')
  }
}

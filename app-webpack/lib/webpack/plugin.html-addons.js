const HtmlWebpackPlugin = require('html-webpack-plugin')

function makeTag (tagName, attributes, closeTag = false) {
  return {
    tagName,
    attributes,
    closeTag
  }
}

// function makeScriptTag (innerHTML) {
//   return {
//     tagName: 'script',
//     closeTag: true,
//     innerHTML
//   }
// }

function fillBaseTag (html, base) {
  return html.replace(
    /(<head[^>]*)(>)/i,
    (_, start, end) => `${ start }${ end }<base href="${ base }">`
  )
}

module.exports.fillBaseTag = fillBaseTag

module.exports.HtmlAddonsPlugin = class HtmlAddonsPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-addons', compilation => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)

      hooks.afterTemplateExecution.tapAsync('webpack-plugin-html-addons', (data, callback) => {
        if (this.cfg.build.appBase) {
          data.html = fillBaseTag(data.html, this.cfg.build.appBase)
        }

        if (this.cfg.ctx.mode.cordova) {
          data.bodyTags.unshift(
            makeTag('script', { src: 'cordova.js' }, true)
          )
        }

        // finally, inform Webpack that we're ready
        callback(null, data)
      })
    })
  }
}

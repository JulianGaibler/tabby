const CopyPlugin = require('copy-webpack-plugin')
const yaml = require('yaml')
const path = require('path')
const fs = require('fs')

const localesPath = path.join(__dirname, 'src/locales')

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.resolveLoader.alias.set('changelog-loader', './webpack/changelog-loader.js')
    config.optimization.minimize(false)
    config.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .type('json')
      .use('yaml-loader')
      .loader('yaml-loader')
      .end()

    config
      .plugin('copy-plugin')
      .use(CopyPlugin, [{
        patterns: [
          {
            from: 'src/manifest.json',
            to: './',
            transform(content) {
              const pkg = require('./package.json')
              const manifest = JSON.parse(content)
              manifest.version = pkg.version
              return JSON.stringify(manifest)
            },
          }, {
            from: 'src/locales/*',
            to: './_locales/[name]/messages.json',
            transform(content) {
              const langFile = yaml.parse(content.toString())
              const manifestFile = {}
              Object.keys(langFile.manifest).forEach(key =>
                manifestFile[key] = { message: langFile.manifest[key] },
              )
              return JSON.stringify(manifestFile)
            },
          },
        ],
      }])

    config
      .plugin('define')
      .tap(args => {
        const locales = fs.readdirSync(localesPath)
          .filter(name => name.endsWith('.yaml'))
          .map(name => name.slice(0, -5))
        const noStrip = locales.filter(name => name.includes('_'))
        args[0] = {
          ...args[0],
          LANGUAGES_SUPPORTED: JSON.stringify(locales),
          LANGUAGES_NOSTRIP: JSON.stringify(noStrip),
        }
        return args
      })
  },
}

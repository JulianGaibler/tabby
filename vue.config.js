const CopyPlugin = require('copy-webpack-plugin')

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
          },
        ],
      }])
  },
}

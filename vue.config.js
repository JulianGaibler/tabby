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
  },
}

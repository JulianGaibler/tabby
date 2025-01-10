import yamlPlugin from '@rollup/plugin-yaml'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs'
import { defineConfig } from 'vite'
import yaml from 'yaml'

const LOCALES_PATH = 'src/locales/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pluginManifest(),
    availableLocales(),
    localeFiles(),
    yamlPlugin(),
    svelte(),
  ],
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '~tint': '/node_modules/tint/dist',
      '@src': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: (d) => {
          const prepend = `@use "@src/styles/utils.sass" as tint\n`
          const match = d.match(/^\s*/)
          const spaces = match ? match[0] : ''
          return `${spaces}${prepend}\n${d}`
        },
      },
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        // background: 'src/scripts/background.ts',
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})

/**
 * Copies the template manifest.json from src/, replaces the version number,
 * adds experimental mappings from the config file and then emits it into
 * dist/.
 */
function pluginManifest() {
  return {
    name: 'copy-extension-manifest',
    async buildStart() {
      this.addWatchFile('package.json')
      this.addWatchFile('src/manifest.json')
      this.addWatchFile('configs/experiment-mappings.yaml')
    },
    async generateBundle() {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      const manifest = JSON.parse(fs.readFileSync('src/manifest.json', 'utf-8'))

      manifest.version = packageJson.version

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2),
      })
    },
  }
}

/** Copies the manifest translations from src/locales/ into dist/_locales/. */
function localeFiles() {
  return {
    name: 'copy-locale-files',
    async buildStart() {
      this.addWatchFile('src/locales/')
    },
    async generateBundle() {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      const manifest = JSON.parse(fs.readFileSync('src/manifest.json', 'utf-8'))

      const toManifestFormat = (content: { [key: string]: string }) => {
        // the desired format is:
        // key: { message: value }
        return Object.fromEntries(
          Object.entries(content).map(([key, value]) => [
            key,
            { message: value },
          ]),
        )
      }

      const files = fs
        .readdirSync('src/locales/')
        // only yaml files
        .filter((file) => file.endsWith('.yaml'))
        // load yaml files and return locale and content
        .map((file) => {
          const locale = file.replace('.yaml', '')
          const content = yaml.parse(
            fs.readFileSync(`src/locales/${file}`, 'utf-8'),
          )
          return { locale, content: toManifestFormat(content.manifest) }
        })

      for (const { locale, content } of files) {
        this.emitFile({
          type: 'asset',
          fileName: `_locales/${locale}/messages.json`,
          source: JSON.stringify(content, null, 2),
        })
      }
    },
  }
}

function availableLocales() {
  const virtualModuleId = 'virtual:available-locales'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'locale-importer', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return
      }
      const locales = fs
        .readdirSync(LOCALES_PATH)
        .filter((file) => file.endsWith('.yaml'))
        .map((file) => file.replace('.yaml', ''))

      // return supportedLanguages -> locales
      return `export const availableLocales = ${JSON.stringify(
        locales,
        null,
        2,
      )}`
    },
  }
}

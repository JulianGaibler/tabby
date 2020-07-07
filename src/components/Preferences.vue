<template>
  <div id="settings">
    <nav class="top-bar">
      <button :aria-label="$t('back-button')" @click="$emit('close')"><ArrowBack/></button>
      <h1>{{ $t('preferences-header') }}</h1>
    </nav>
    <hr>
    <main class="content">
      <section>
        <label for="input-shortcut">
          <h2>{{ $t('preferences-shortcut-headline') }}</h2>
          <i18n path="preferences-shortcut-explanation.message" tag="p">
            <a
              :href="isChromeAPI ? $t('url-changing-shortcuts-chrome') : $t('url-changing-shortcuts-firefox')"
              rel="noopener"
              target="_blank">{{ $t('preferences-shortcut-explanation.url') }}</a>
          </i18n>
        </label>
        <div>
          <input
            id="input-shortcut"
            type="text"
            disabled
            :value="selectedShortcut">
        </div>
      </section>
      <section>
        <label for="input-language">
          <h2>{{ $t('preferences-language-headline') }}</h2>
          <i18n path="preferences-language-contribute.message" tag="p">
            <a href="https://github.com/JulianWels/tabby#contribution-and-commits" rel="noopener" target="_blank">{{ $t('preferences-language-contribute.url') }}</a>
          </i18n>
        </label>
        <div>
          <select id="input-language"  v-model="selectedLanguage">
            <option
              value="system"
              :selected="selectedLanguage === 'system'">
              {{ $t('language-system') + (selectedLanguage === 'system' ? ` (${actualLanguage})` : '')}}
            </option>
            <option
              v-for="{id, tag} in languages"
              :key="id"
              :value="id"
              :selected="selectedLanguage === id">{{ $t(tag) }}</option>
          </select>
        </div>
      </section>
      <section>
        <label for="input-theme">
          <h2>{{ $t('preferences-theme-headline') }}</h2>
          <p>{{ $t('preferences-theme-explanation') }}</p>
        </label>
        <div>
          <select id="input-theme"  v-model="selectedTheme">
            <option value="system" :selected="selectedTheme === 'system'">{{ $t('theme-system') }}</option>
            <option
              v-for="{id, tag} in themes"
              :key="id"
              :value="id"
              :selected="selectedTheme === id">{{ $t(tag) }}</option>
          </select>
        </div>
      </section>
      <section>
        <label for="input-icon">
          <h2>{{ $t('preferences-icon-headline') }}</h2>
          <p>{{ $t('preferences-icon-explanation') }}</p>
        </label>
        <div>
          <select id="input-icon"  v-model="selectedIcon">
            <option value="default" :selected="selectedIcon === 'default'">{{ $t('icon-default') }}</option>
            <option
              v-for="{id, tag} in icons"
              :key="id"
              :value="id"
              :selected="selectedIcon === id">{{ $t(tag) }}</option>
          </select>
        </div>
      </section>
      <section>
        <label>
          <h2>{{ $t('preferences-recommend-headline') }}</h2>
          <p>{{ $t('preferences-recommend-review') }}</p>
          <i18n path="preferences-recommend-feedback.message" tag="p">
            <a href="https://twitter.com/JulianWels" rel="noopener" target="_blank">{{ $t('preferences-recommend-feedback.url') }}</a>
          </i18n>
        </label>
      </section>
      <footer>
        Made by <a href="https://jwels.berlin/" rel="noopener" target="_blank"><WelsIcon/></a> in Berlin
      </footer>
    </main>
    <hr>
    <footer class="bottom-bar">
      <div>tabby {{clientVersion}}</div>
      <div><a href="https://github.com/JulianWels/tabby" rel="noopener" target="_blank">{{ $t('source-code') }}</a> // © 2020 Julian Wels</div>
    </footer>
  </div>
</template>

<script>
import ArrowBack from '@/assets/arrow_back_nav_centered.svg?inline'
import WelsIcon from '@/assets/wels-logo-mini.svg?inline'

import { shortcutGet, isChromeAPI } from '@/extensionApi'
import { setLanguage, getLanguage, getActualLanguage, languageOptions } from '@/localization'
import { setTheme, getTheme, themeOptions, setIcon, getIcon, iconOptions } from '@/theme'

const clientVersion = require('@/../package.json').version
const languages = languageOptions.map(option => ({ id: option, tag: `language-name-${option}` }))
const themes = themeOptions.map(option => ({ id: option, tag: `theme-${option}` }))
const icons = iconOptions.map(option => ({ id: option, tag: `icon-${option}` }))

export default {
  name: 'Preferences',
  components: {
    ArrowBack, WelsIcon,
  },
  data () {
    return {
      clientVersion,
      isChromeAPI,

      languages,
      themes,
      icons,
      selectedShortcut: '',
      selectedLanguage: getLanguage(),
      actualLanguage: getActualLanguage(),
      selectedTheme: getTheme(),
      selectedIcon: getIcon(),
    }
  },
  async mounted() {
    this.selectedShortcut = await shortcutGet('_execute_browser_action')
  },
  watch: {
    selectedTheme(val) {
      setTheme(val)
    },
    selectedLanguage(val) {
      setLanguage(val)
      this.actualLanguage = getActualLanguage()
    },
    selectedIcon(val) {
      setIcon(val)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "~@/assets/styles/palette"

#settings
  > nav
    display flex
    align-items center
    height 50px
    h1
      margin 0
      font-size 17px
      font-weight 400
    button
      width 50px
      align-self stretch
      path
        themed fill font-color
  > main
    padding 0 50px
    a
      themed color brand-color
    section
      margin 1rem 0
      display flex
      label
        display block
        flex 1
        h2
          font-size 15px
          font-weight 400
          margin 0
        p
          font-size 13px
          font-weight 400
          margin 0
          margin-top .25rem
      input, select
        themed border seperator-color 1px solid
        themed background-color light-background
        themed color input-color
        box-sizing border-box
        border-radius 15px
        padding 10px
        width 8rem
        margin-left 1rem
      select
        appearance none
        background-image url('~@/assets/dropdown.svg')
        background-repeat no-repeat
        background-position right 10px center
        background-size 16px
        padding-right 30px
    > footer
      text-align center
      padding 1rem
      font-size 13px
      margin-top 3rem
      svg
        margin-left -1px
        path
          themed fill font-color
  > footer
    themed background background-odd
    themed color font-color-light
    justify-content space-between
    padding .5rem .75rem
    display flex
    font-size 11px
    a
      color inherit
      text-decoration none
</style>

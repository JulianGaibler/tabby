<template>
  <div id="settings">
    <nav class="top-bar">
      <button ref="backbutton" :aria-label="$t('back-button')" @click="$emit('close')"><ArrowBack/></button>
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
          <select id="input-language" v-model="selectedLanguage" @change="onSelectedLanguage">
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
          <select id="input-theme" v-model="selectedTheme" @change="onSelectedTheme">
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
          <select id="input-icon" v-model="selectedIcon" @change="onSelectedIcon">
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
        <label for="accent-color-radio">
          <h2>{{ $t('preferences-accent-color-headline') }}</h2>
          <p>{{ $t('preferences-accent-color-explanation') }}</p>
        </label>
        <div>

          <div class="color-picker">
            <div v-for="{id, tag, color} in accentColors" :key="id">
              <input
                name="accent-color-radio"
                type="radio"
                :id="id"
                :style="{ background: color }"
                v-model="selectedAccentColor"
                @change="onSelectedAccentColor"
                :value="id"
                :checked="selectedAccentColor === id">
              <label :for="id">{{ $t(tag) }}</label>
            </div>
          </div>
        </div>
      </section>

      <section>
        <label for="input-show-overview">
          <h2>{{ $t('preferences-show-overview-headline') }}</h2>
          <p>{{ $t('preferences-show-overview-explanation') }}</p>
        </label>
        <div class="switch-box">
          <input
            v-if="showOverview !== null"
            v-model="showOverview"
            @change="onShowOverview"
            id="input-show-overview"
            type="checkbox"
            class="switch" />
        </div>
      </section>

      <section>
        <label for="input-accessibility">
          <h2>{{ $t('preferences-accessibility-headline') }}</h2>
          <p>{{ $t('preferences-accessibility-explanation') }}</p>
        </label>
        <div class="switch-box">
          <input
            v-if="accessibility !== null"
            v-model="accessibility"
            @change="onAccessibility"
            id="input-accessibility"
            type="checkbox"
            class="switch" />
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
import { setTheme, getTheme, getAccentColor, setAccentColor, themeOptions, setIcon, getIcon, iconOptions, accentColorMap } from '@/theme'
import { PREFS, getPref, setPref } from '@/general-preferences'

const clientVersion = require('@/../package.json').version
const languages = languageOptions.map(option => ({ id: option, tag: `language-name-${option}` }))
const themes = themeOptions.map(option => ({ id: option, tag: `theme-${option}` }))
const accentColors = Object.keys(accentColorMap).map(key => ({ id: key, tag: `accent-color-${key}`, color: accentColorMap[key][0] }))
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
      accentColors,
      icons,
      selectedShortcut: '',
      selectedLanguage: getLanguage(),
      actualLanguage: getActualLanguage(),
      selectedTheme: getTheme(),
      selectedAccentColor: getAccentColor(),
      selectedIcon: getIcon(),
      showOverview: null,
      accessibility: null,
    }
  },
  mounted() {
    this.$refs.backbutton.focus()
    shortcutGet('_execute_browser_action').then(val => this.selectedShortcut = val)
    getPref(PREFS.SHOW_OVERVIEW).then(val => this.showOverview = val )
    getPref(PREFS.IMPROVED_ACCESSIBILITY).then(val => this.accessibility = val )
  },
  methods: {
    onSelectedTheme() {
      setTheme(this.selectedTheme)
    },
    onSelectedAccentColor() {
      setAccentColor(this.selectedAccentColor)
    },
    onSelectedLanguage() {
      setLanguage(this.selectedLanguage)
      this.actualLanguage = getActualLanguage()
    },
    onSelectedIcon() {
      setIcon(this.selectedIcon)
    },
    onShowOverview() {
      setPref(PREFS.SHOW_OVERVIEW, this.showOverview)
    },
    onAccessibility() {
      setPref(PREFS.IMPROVED_ACCESSIBILITY, this.accessibility)
    },
  },
}
</script>

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
      themed color accent-color-light
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
      > input, select, #input-shortcut
        themed border seperator-color 1px solid
        themed background-color background-odd
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
      .switch-box
        display flex
        align-items center
        padding-left 2rem
    > footer
      text-align center
      padding 1rem
      font-size 13px
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


input.switch
  appearance none
  position relative
  display block
  themed background input-color
  height 1.25rem
  width 2.25rem
  border-radius 1.25rem
  padding .25rem
  transition padding .15s, background .15s
  &::after
    position absolute
    content ''
    display block
    background white
    height .75rem
    width .75rem
    border-radius .75rem
  &:checked
    themed background accent-color-light
    padding-left 1.25rem


.color-picker
  display grid
  grid-template-columns 1fr 1fr 1fr 1fr
  input
      appearance none
      themed color font-color
      flex-shrink 0
      box-sizing border-box
      height 1rem
      width 1rem
      position relative
      margin 0.5rem 0.5rem 0.5rem 0.1rem
      border-radius 50%
      margin-bottom -5%
      &:focus.focus-visible
          box-shadow 0px 0px 0 .25rem rgba(white, 0.1)
      &::before
          border-radius 50%
      &::after
          border-radius 50%
          content ''
          display block
          top -.5rem
          left -.5rem
          right -.5rem
          bottom -.5rem
          opacity 0
          transition opacity .1s
          position absolute
          background #FFFFFF
      &:active::after
          opacity .1
      &::before
          content ''
          display block
          background #FFFFFF
          width 100%
          height 100%
          transition transform 0.25s
          transform scale(0)
      &:checked::before
          transform scale(0.4)
    label
      position absolute
      left -10000px
      top auto
      width 1px
      height 1px
      overflow hidden
</style>

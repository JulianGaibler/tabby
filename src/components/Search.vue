<template>
  <div id="search">
    <div class="search top-bar">
      <button :aria-label="$t('preferences-button')" @click="$emit('showSettings')"><TabbyIcon/></button>
      <input
        autofocus
        ref="searchinput"
        :aria-label="$t('search-input.aria-label')"
        :placeholder="$t('search-input.placeholder')"
        spellcheck="false"
        type="text"
        v-model="searchString"
        @input="handleSearch">
      <div v-if="totalTabs" class="tab-counter"><span>{{ totalTabs }}</span></div>
    </div>
    <template v-if="showFirstTime">
      <hr>
      <div class="info content">
        <div class="cat-search"></div>
        <h1>{{ $t('onboarding-headline') }}</h1>
        <p>{{ $t('onboarding-instructions') }}</p>
        <p>{{ $t('onboarding-about-settings') }}</p>
      </div>
    </template>
    <template v-if="!hideNoResult && results.length < 1 && searchString.length > 0">
      <hr>
      <div class="info content">
        <div class="cat-noresults"></div>
        <p>{{ $t('search-no-result') }}</p>
      </div>
    </template>
    <template v-else-if="results.length > 0">
      <hr>
      <div class="tabs content">
        <TabItem
          class="tab"
          v-for="(tab, index) in results"
          ref="items"
          @click="openTab(tab.id)"
          @mouseDown="el => focusTab(index, true, el)"
          @focus="focusTab(index, true)"
          @pinTab="pinTab(index)"
          @muteTab="muteTab(index)"
          @closeTab="closeTab(tab.id)"
          :key="index.id"
          :tab="tab"
          :active="index === highlighted"/>
      </div>
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line
import Fuse from 'fuse.js/dist/fuse.basic.esm.js'
import Vue from 'vue'
import debounce from 'debounce'
import highlight from '@/fuse-highlight'
import { queryTabs, updateTabs, closeTab, firstTimeSetup } from '@/extensionApi'
import { PREFS, getPref } from '@/general-preferences'

import TabItem from '@/components/TabItem.vue'

import TabbyIcon from '@/assets/tabby-icon.svg?inline'

const INDEX_OPTIONS = { keys: ['title', 'url'],  includeMatches: true }

export default {
  name: 'Search',
  components: {
    TabbyIcon, TabItem,
  },
  data () {
    return {
      searchString: '',
      results: [],
      totalTabs: false,
      highlighted: 0,
      fuseInstance: undefined,
      showFirstTime: false,
      hideNoResult: true,
      userPrefs: null,
    }
  },
  async mounted() {
    // Register event listener
    document.addEventListener('keydown', this.handleInput)

    const [tabs, showOverview, accessibility] = await Promise.all([
      queryTabs({ currentWindow: true }),
      getPref(PREFS.SHOW_OVERVIEW),
      getPref(PREFS.IMPROVED_ACCESSIBILITY),
    ])

    this.userPrefs = { showOverview, accessibility }
    this.totalTabs = tabs.length

    const myIndex = Fuse.createIndex(INDEX_OPTIONS.keys, tabs)
    this.fuseInstance = new Fuse(tabs, INDEX_OPTIONS, myIndex)
    this.handleSearch()
    firstTimeSetup().then(r => {
      this.showFirstTime = r
    })
  },
  unmount() {
    document.removeEventListener('keydown', this.handleInput)
  },
  methods: {
    async reload(focusInput=true) {
      let tabs = await queryTabs({ currentWindow: true })

      this.totalTabs = tabs.length

      const myIndex = Fuse.createIndex(INDEX_OPTIONS.keys, tabs)
      this.fuseInstance.setCollection(tabs, myIndex)
      this.handleSearch(true)
      if (focusInput && !this.userPrefs.accessibility) this.$refs.searchinput.focus()
    },
    handleSearch: debounce(function(keepPosition=false) {
      this.showFirstTime = false
      this.hideNoResult = true

      if (!this.fuseInstance) return

      if (this.searchString.length < 1) {
        if (this.userPrefs.showOverview) this.results = this.fuseInstance._myIndex.docs
      } else {
        this.results = highlight(this.fuseInstance.search(this.searchString))
      }

      if (keepPosition === true) {
        Vue.nextTick(() => this.focusTab(Math.min(this.results.length, this.highlighted)))
      } else if (this.searchString.length < 1) {
        Vue.nextTick(() => this.focusTab(this.results.findIndex(tab => tab.active)))
      } else {
        Vue.nextTick(() => this.focusTab(0))
      }

      this.hideNoResult = false
    }, 100),
    handleInput(event) {
      const key = event.key.toLowerCase()
      const inputFocused = document.activeElement === this.$refs.searchinput
      let focusInput = !event.altKey
      if (event.altKey) {
        if (inputFocused) this.$refs.items[this.highlighted].$el.focus()
        switch (event.code) {
        case 'KeyP':
          this.pinTab(this.highlighted)
          break
        case 'KeyM':
          this.muteTab(this.highlighted)
          break
        case 'Backspace':
          this.closeTab(this.results[this.highlighted].id)
          break
        default:
          focusInput = true
        }
      } else {
        switch (key) {
        case 'arrowdown':
          this.focusTab(this.highlighted+1)
          break
        case 'arrowup':
          this.focusTab(this.highlighted-1)
          break
        case 'tab':
          focusInput = false
          if (inputFocused && !event.shiftKey && !this.userPrefs.accessibility) {
            this.$refs.items[this.highlighted].$el.focus()
          }
          break
        case 'escape':
          window.close()
          break
        case 'enter':
          focusInput = false
          if (inputFocused) this.openTab(this.results[this.highlighted].id)
          break
        case 'delete':
          if (inputFocused && this.$refs.searchinput.selectionStart == this.searchString.length) this.closeTab(this.results[this.highlighted].id)
          break
        }
      }
      if (focusInput && !this.userPrefs.accessibility) this.$refs.searchinput.focus()
    },
    focusTab(index, byClick=false, el=null) {
      if (index < 0 || index >= this.results.length) {
        return
      }
      this.highlighted = index
      if (!byClick) {
        this.$refs.items[index].$el.scrollIntoView({
          block: 'center',
        })
      }
      if (el) {
        el.focus()
      }
    },
    openTab(id) {
      updateTabs(id, { active: true })
      window.close()
    },
    pinTab(index) {
      const tab = this.results[index]
      updateTabs(tab.id, { pinned: !tab.pinned })
        .then(() => this.reload())
    },
    muteTab(index) {
      const tab = this.results[index]
      updateTabs(tab.id, { muted: !tab.mutedInfo.muted })
        .then(() => this.reload(false))
    },
    closeTab(id) {
      closeTab(id)
        .then(() => this.reload())
    },
  },
}
</script>

<style scoped lang="stylus">
@import "~@/assets/styles/palette"

#search
  .search
    flex-shrink 0
    display flex
    align-items stretch
    height 56px
    themed background background-odd
    input
      flex 1
      font-size 17px
      border none
      outline none
    button
      width 56px
      svg
        width 32px
        height 32px
        path
          themed fill font-color
    .tab-counter
      display flex
      justify-content center
      align-items center
      padding 0 1rem
      span
        display block
        themed background background
        themed color font-color-light
        font-size 12px
        border-radius 8px
        padding .25rem .5rem
  .info
    display flex
    flex-direction column
    text-align center
    padding 5%
    h1
      font-size 17px
      font-weight 600
      margin-bottom 1rem
    p
      margin .1rem
      font-size 15px
  .cat-noresults, .cat-search
    background no-repeat center
    height 200px
    margin-bottom 1rem
  .cat-noresults
    themed background-image image-cat-noresults
  .cat-search
    themed background-image image-cat-search
</style>

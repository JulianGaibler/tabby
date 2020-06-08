<template>
  <div id="search">
    <div class="search top-bar">
      <button :aria-label="$t('preferences-button')" @click="$emit('showSettings')"><TabbyIcon/></button>
      <input
        autofocus
        :aria-label="$t('search-input.aria-label')"
        :placeholder="$t('search-input.placeholder')"
        spellcheck="false"
        type="text"
        v-model="searchString"
        @input="handleSearch"
        @keydown.down="handleInput('down')"
        @keydown.up="handleInput('up')"
        @keydown.escape="handleInput('escape')"
        @keydown.enter="handleInput('enter')">
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
          @mouseDown="focusTab(index, true)"
          @focus="focusTab(index, true)"
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
import debounce from 'debounce'
import highlight from '@/fuse-highlight'
import { queryTabs, updateTabs, firstTimeSetup } from '@/extensionApi'

import TabItem from '@/components/TabItem.vue'

import TabbyIcon from '@/assets/tabby-icon.svg?inline'

export default {
  name: 'Search',
  components: {
    TabbyIcon, TabItem,
  },
  data () {
    return {
      searchString: '',
      results: [],
      highlighted: 0,
      fuseInstance: undefined,
      showFirstTime: false,
      hideNoResult: true,
    }
  },
  async mounted() {
    let tabs = await queryTabs({ currentWindow: true })

    const options = { keys: ['title', 'url'],  includeMatches: true }
    const myIndex = Fuse.createIndex(options.keys, tabs)
    this.fuseInstance = new Fuse(tabs, options, myIndex)
    firstTimeSetup().then(r => {
      this.showFirstTime = r
    })
  },
  methods: {
    handleSearch: debounce(function() {
      this.showFirstTime = false
      this.hideNoResult = true
      if (!this.fuseInstance || this.searchString.length < 1) {
        this.results = []
        return
      }
      this.results = highlight(this.fuseInstance.search(this.searchString))
        .map((item) => ({
          title: item.title,
          url: item.url,
          favIconUrl: item.favIconUrl,
          id: item.id,
        }))
      this.hideNoResult = false
    }, 100),
    handleInput(key) {
      switch (key) {
      case 'down':
        this.focusTab(this.highlighted+1)
        break
      case 'up':
        this.focusTab(this.highlighted-1)
        break
      case 'escape':
        window.close()
        break
      case 'enter':
        this.openTab(this.results[this.highlighted].id)
        break
      }
    },
    focusTab(index, byClick=false) {
      this.highlighted = index
      if (!byClick) {
        this.$refs.items[index].$el.scrollIntoView({
          block: 'center',
        })
      }
    },
    openTab(id) {
      updateTabs(id, { active: true })
      window.close()
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
    height 50px
    themed background background-odd
    input
      flex 1
      font-size 17px
      padding 0 10px
      border none
      outline none
    button
      width 50px
      svg path
        themed fill font-color
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

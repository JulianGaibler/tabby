<template>
  <div id="app">
    <Preferences v-if="showPreferences" @close="setPreferences(false)" />
    <Search v-else @showSettings="setPreferences(true)" />
  </div>
</template>

<script>
import Search from '@/components/Search.vue'
import Preferences from '@/components/Preferences.vue'

export default {
  name: 'App',
  components: {
    Search, Preferences,
  },
  data () {
    return {
      showPreferences: false,
    }
  },
  methods: {
    setPreferences(value) {
      this.showPreferences = value
    },
  },
}
</script>

<style lang="stylus">
@import "~@/assets/styles/palette"
@import "~@/assets/styles/mixins"

  input, button
    padding 0
    border none
    color inherit
    background unset
  html
    themed color font-color
    themed background background
    remove-native()
  html, body
    margin 0
    width 600px
    font-family -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif
  #app > *
    max-height 500px
    display flex
    flex-direction column
    .top-bar, .bottom-bar
      flex-shrink 0
    .content
      flex 1
      overflow-y auto
      &::-webkit-scrollbar
          width .5em
          height .5em
      &::-webkit-scrollbar-thumb
        themed background-color scroll-bar
        border-radius 2rem
  hr
    margin 0
    border 0
    height 0
    themed border-bottom seperator-color 1px solid
</style>

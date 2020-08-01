<template>
  <button
    class="tab"
    :class="{ active, current: tab.active }"
    @click="click"
    @mousedown="mouseDown"
    @focus="focus">
    <div class="favicon">
      <span v-if="!tab.favIconUrl"><TabbyIcon/></span>
      <img v-else :src="tab.favIconUrl">
    </div>
    <div class="text">
      <h1 v-if="tab.title_hl" :aria-label="tab.title" v-html="tab.title_hl"></h1>
      <h1 v-else>{{tab.title}}</h1>
      <p v-if="tab.url_hl" :aria-label="tab.url" v-html="tab.url_hl"></p>
      <p v-else>{{tab.url}}</p>
    </div>
    <div class="actions">
      <button @click="closeTab" :aria-label="$t('close-tab-button')" :tabindex="active ? 0 : -1"><CloseIcon /></button>
      <button
        v-if="tab.audible || tab.mutedInfo.muted"
        @click="muteTab"
        class="alwaysVisable"
        :class="{ enabled: tab.mutedInfo.muted }"
        :aria-label="tab.mutedInfo.muted ? $t('unmute-tab-button') : $t('mute-tab-button')"
        :tabindex="active ? 0 : -1"><AudioOffIcon v-if="tab.mutedInfo.muted" /><AudioOnIcon v-else /></button>
      <button
        @click="pinTab"
        :class="{ alwaysVisable: tab.pinned, enabled: tab.pinned }"
        :aria-label="tab.pinned ? $t('unpin-tab-button') : $t('pin-tab-button')"
        :tabindex="active ? 0 : -1"><PinIcon /></button>
    </div>
  </button>
</template>

<script>
import TabbyIcon from '@/assets/tabby_favicon.svg?inline'
import CloseIcon from '@/assets/close.svg?inline'
import PinIcon from '@/assets/push_pin.svg?inline'
import AudioOffIcon from '@/assets/volume_off.svg?inline'
import AudioOnIcon from '@/assets/volume_up.svg?inline'

export default {
  name: 'TabItem',
  props: {
    tab: Object,
    active: Boolean,
  },
  components: {
    TabbyIcon, CloseIcon, PinIcon, AudioOffIcon, AudioOnIcon,
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
    mouseDown() {
      this.$emit('mouseDown', this.$el)
    },
    focus(e) {
      this.$emit('focus', e)
    },
    pinTab(e) {
      e.stopPropagation()
      this.$emit('pinTab', e)
    },
    closeTab(e) {
      e.stopPropagation()
      this.$emit('closeTab', e)
    },
    muteTab(e) {
      e.stopPropagation()
      this.$emit('muteTab', e)
    },
  },
}
</script>

<style lang="stylus">
@import "~@/assets/styles/palette"

.tab
  display flex
  border none
  background unset
  width 100%
  text-align left
  padding .9rem
  outline none
  .favicon, .actions
    display flex
    justify-content center
    align-items center
  .favicon
    margin-right 0.75rem
    width 2rem
    height 2rem
    border-radius 50%
    themed background background-odd
    themed background light-background
    span, img
      display block
      width 16px
      height 16px
      padding 2px
    span svg
      themed fill font-color
    img
      border-radius 4px
  .text
    flex 1
    min-width 0
    h1, p
      font-weight 400
      grid-column-start 2
      margin 0
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
    h1
      font-size 15px
    p
      font-size 11px
      grid-row-start 2
  .actions
    margin-left 0.75rem
    button
      width 24px
      height 24px
      themed background background-odd
      border-radius 50%
      &:not(:last-child)
        margin-right .5rem
      svg
        themed fill font-color
        padding 3px
        width 18px
        height 18px
      &:focus
        outline none
        box-shadow 0 0 0 0.2rem rgba(255,255,255, .5)
      &:active
        box-shadow 0 0 0 0.4rem rgba(255,255,255, .75)
      &.enabled
        themed background-color accent-color
        svg
          themed fill background

  &:not(.active):not(:focus):not(:hover) .actions button:not(.alwaysVisable)
      display none

  .highlight
      padding 0
      padding-top .2em
      padding-bottom .2em
      margin 0
      background-color rgba(0, 0, 0, 0.05)
      border-radius 6px
      &::before, &::after
        letter-spacing -0.2em
        content "\00a0"
  &.current:not(.active)
    themed background-color background-odd
    .favicon, .actions button:not(.enabled)
      themed background-color background
      themed background light-background

  &.active, &:focus
    themed background-color accent-color
    themed color selected-color
    .favicon
      background rgba(0,0,0,0.1)
    .actions button
      background rgba(0,0,0,0.1)
      svg
        fill white
      &.enabled
        background white
        svg
          themed fill accent-color
  .actions button:not(.enabled):focus
    outline none
    themed background-color background
    svg
      themed fill accent-color
</style>

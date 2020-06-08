<template>
  <button
    class="tab"
    :class="{ active }"
    @click="click"
    @mousedown="mouseDown"
    @focus="focus">
    <div class="favicon">
      <span v-if="!tab.favIconUrl"></span>
      <img v-else :src="tab.favIconUrl">
    </div>
    <h1 v-html="tab.title"></h1>
    <p v-html="tab.url"></p>
  </button>
</template>

<script>
export default {
  name: 'TabItem',
  props: {
    tab: Object,
    active: Boolean,
  },
  methods: {
    click(e) {
      this.$emit('click', e)
    },
    mouseDown(e) {
      this.$emit('mouseDown', e)
    },
    focus(e) {
      this.$emit('focus', e)
    },
  },
}
</script>

<style lang="stylus">
@import "~@/assets/styles/palette"

.tab
  display block
  border none
  background unset
  width 100%
  text-align left
  display grid
  grid-template-columns auto 1fr
  padding .8rem 1rem
  .favicon
    padding-right .5rem
    span, img
      display block
      width 16px
      height 16px
      padding 2px
      themed background light-background
    span
      border-radius 50%
    img
      border-radius 4px
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
  .highlight
      padding 0
      padding-top .2em
      padding-bottom .2em
      margin 0
      themed color font-color-contrast
      background-color rgba(0, 0, 0, 0.03)
      border-radius 6px
      &::before, &::after
        letter-spacing -0.2em
        content "\00a0"
  &.active, &:focus
    themed background-color background-selected
</style>

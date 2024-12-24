<script lang="ts">
  import { _ } from 'svelte-i18n'
  import iconDropdown from 'tint/icons/14-dropdown.svg?raw'
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import tabGroups from '@src/utils/group-store'
  import * as extAPI from '@src/utils/extension-api'

  const dispatch = createEventDispatcher()

  export let groupId: number
  export let focus: [number, number]
  export let claimFocus: boolean
  export let nth: number
  export let collapsed: boolean

  let buttonElement: HTMLButtonElement | null = null

  $: focusElement(focus)
  $: isFocused = focus[0] === nth

  onMount(() => {
    focusElement(focus)
  })

  function focusElement(f: [number, number]) {
    if (f[0] !== nth) {
      return
    }
    buttonElement?.scrollIntoView({
      behavior: claimFocus ? 'smooth' : 'instant',
      block: claimFocus ? 'nearest' : 'center',
    })
    if (!claimFocus) {
      return
    }
    buttonElement?.focus()
  }

  function toggleCollapsed() {
    groupId && extAPI.updateGroup(groupId, { collapsed: !collapsed })
    dispatch('action-at', nth)
  }
</script>

<div class={`group-title chromeGroupColor ${$tabGroups[groupId]?.color || ''}`}>
  <button
    class="tint--type-ui-bold"
    class:collapsed
    bind:this={buttonElement}
    class:focus={isFocused}
    tabindex={isFocused ? 0 : -1}
    aria-expanded={!collapsed}
    aria-controls={`group-${groupId}`}
    on:click={toggleCollapsed}
    ><span class="icon">{@html iconDropdown}</span><span
      >{$tabGroups[groupId]?.title || 'Unnamed Group'}</span
    ></button
  >
</div>

<style lang="sass">
.group-title
  margin-inline: tint.$size-12
  line-height: 0
  > button
    border: none
    line-height: initial
    display: inline-block
    border-radius: tint.$size-64
    background: var(--special-color-bg)
    color: var(--special-color)
    padding-block: tint.$size-2
    padding-inline: tint.$size-8
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    max-width: 100%
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: center
    gap: tint.$size-4
    position: relative
    &:focus-visible, &.focus
      outline: 2px solid var(--tint-action)
      outline-offset: 2px
      @media (forced-colors: active)
        outline-color: CanvasText
    &:active::after
      content: ''
      position: absolute
      inset: 0
      background: var(--tint-action-secondary-active)
      border-radius: inherit
      pointer-events: none
    > .icon
      line-height: 0
      transition: transform 0.2s ease
    &.collapsed
      > .icon
        transform: rotate(-90deg)

</style>

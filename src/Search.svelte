<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Button from 'tint/components/Button.svelte'
  import Menu, { type ContextClickHandler } from 'tint/components/Menu.svelte'
  import TabbyIcon from '@src/assets/tabby-icon.svg?raw'
  import iconDropdown from 'tint/icons/14-dropdown.svg?raw'
  import TabItem from '@src/components/TabItem.svelte'
  import tabs from '@src/utils/tab-store'
  import Fuse from 'fuse.js'
  import fuseHighlight, { type HighlightResult } from './utils/fuse-highlight'
  import * as extAPI from '@src/utils/extension-api'
  import { findGroups, type IndexInfo } from './utils/tab-utils'
  import tabGroups from '@src/utils/group-store'
  import state from '@src/utils/state-store'
  import GroupItem from './components/GroupItem.svelte'
  import { tabActions } from './utils/tab-actions'
  import { createEventDispatcher } from 'svelte'

  $: console.log('state', $state)

  const INDEX_OPTIONS = { keys: ['title', 'url'], includeMatches: true }
  const dispatch = createEventDispatcher()

  let searchString = ''
  let fuse: Fuse<extAPI.CombinedTab> | null = null

  let contextClick: ContextClickHandler | undefined = undefined

  let focus: [number, number] = [-1, 0]
  let searchFieldFocus = true
  let searchField: HTMLInputElement | null = null
  let focusLeft: () => void
  let focusRight: () => void

  function updateFuseInstance(tabs: extAPI.CombinedTab[]) {
    const index = Fuse.createIndex(INDEX_OPTIONS.keys, tabs)
    if (!fuse) {
      fuse = new Fuse(tabs, INDEX_OPTIONS, index)
    } else {
      fuse.setCollection(tabs, index)
    }
  }

  function searchTabs(
    tabs: extAPI.CombinedTab[],
    searchString: string,
    fuse: Fuse<extAPI.CombinedTab> | null,
    showOverview: boolean,
  ): HighlightResult<extAPI.CombinedTab>[] {
    const noSearch = searchString.trim().length === 0
    if (!showOverview && noSearch) {
      return []
    }
    if (!fuse || noSearch) {
      return tabs as HighlightResult<extAPI.CombinedTab>[]
    }
    const results = fuseHighlight(fuse.search(searchString))
    focus = [results.length === 0 ? -1 : 0, focus[1]]
    return results
  }

  function onUpdateListItems(r: IndexInfo[]) {
    const noSearch = searchString.trim().length === 0
    if (noSearch || !fuse) {
      if (focus[0] === -1) {
        focus = [groupResults.activeTabIndex, 0]
      }
      return
    }
    if (r.length === 0) {
      focus = [-1, 0]
    } else {
      // search for the first result that is not a group
      let i = 0
      while (i < r.length && r[i].type === 'group') i++
      if (i < r.length) focus = [i, focus[1]]
      else focus = [-1, focus[1]]
    }
  }

  $: console.log('$state.preferences?.showOverview', $state.preferences?.showOverview)

  $: updateFuseInstance($tabs)
  $: searchResults = searchTabs(
    $tabs,
    searchString,
    fuse,
    $state.preferences?.showOverview || false,
  )
  $: groupResults = findGroups(
    searchResults,
    $tabGroups,
    searchString.trim().length > 0 || !$state.preferences?.showGroupTabs,
  )
  $: onUpdateListItems(groupResults.groupIndices)

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      searchFieldFocus = false
      changeFocus(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      searchFieldFocus = false
      changeFocus(-1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      searchFieldFocus = false
      focusLeft()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      searchFieldFocus = false
      focusRight()
    } else if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      e.key !== ' '
    ) {
      searchField?.focus()
    }
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const tabId = searchResults[focus[0]].id
      if (tabId) {
        extAPI.openTab(tabId)
      }
    }
  }

  function changeFocus(diff: -1 | 0 | 1 = 0) {
    const newFocus = focus[0] + diff
    if (newFocus < 0 || newFocus >= groupResults.totalIndices) {
      return
    }

    focus = [newFocus, focus[1]]
  }

  function handleFocusChange(e: CustomEvent<number>) {
    if (e.detail === undefined || e.detail === -1) {
      changeFocus(0)
    } else {
      focus = [e.detail, 0]
      changeFocus(0)
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<header class="tint--tinted">
  <Button icon={true} variant="ghost" title={$_('preferences-button')} on:click={() => dispatch('toggle-preferences')}
    >{@html TabbyIcon}</Button
  >
  <input
    type="search"
    placeholder={$_('search-input.placeholder')}
    aria-label={$_('search-input.aria-label')}
    spellcheck="false"
    class="tint--type-body-sans"
    bind:value={searchString}
    bind:this={searchField}
    on:focus={() => (searchFieldFocus = true)}
    on:blur={() => (searchFieldFocus = false)}
    on:keydown={handleInputKeydown}
  />
  <button
    class="tabs"
    on:click={contextClick}
    on:mousedown={contextClick}
    title={$_('search-tab-counter', { values: { n: 12 } })}
  >
    <span>{$tabs.length}</span>
    {@html iconDropdown}
  </button>
  <Menu variant="button" items={tabActions} bind:contextClick />
</header>

<div class="main-area" tabindex="-1">
  {#each groupResults.groupIndices as item}
    {#if item.type === 'group'}
      <GroupItem
        groupId={item.groupId}
        bind:focus
        on:action-at={handleFocusChange}
        claimFocus={!searchFieldFocus}
        nth={item.focusIndex}
        collapsed={item.collapsed}
      />
    {:else if item.type === 'tabs'}
      <ul id={`group-${item.groupId || ''}`}>
        {#each item.items as tabInfo}
          <TabItem
            tab={searchResults[tabInfo.tabIndex]}
            nth={tabInfo.focusIndex}
            bind:focus
            bind:focusLeft
            bind:focusRight
            on:action-at={handleFocusChange}
            on:focus-set={(e) => {
              if (e.detail === 0) {
                focus = [0, 0]
                changeFocus(0)
              } else if (e.detail === 1) {
                focus = [searchResults.length - 1, 0]
                changeFocus(0)
              }
            }}
            claimFocus={!searchFieldFocus}
          />
        {/each}
      </ul>
    {/if}
  {/each}
</div>

<style lang="sass">
  input
    flex: 1
    background: none
    border: none
    color: var(--tint-text)
    font-family: inherit
    height: 100%
    &::-webkit-search-cancel-button
      display: none
    &:focus
      outline: none
    &::placeholder
      opacity: 0.5
      color: var(--tint-text)
  .tabs
    border: none
    background: var(--tint-input-bg)
    padding: tint.$size-4 + tint.$size-2
    padding-block-start: tint.$size-4 + tint.$size-2 + 2px
    border-radius: tint.$size-8
    line-height: 1
    display: flex
    align-items: center
    margin-inline-end: tint.$size-8
    gap: tint.$size-2
    > :global(*)
      pointer-events: none
    > :global(svg)
      width: 8px
      height: 8px

  .main-area, ul
    display: flex
    flex-direction: column
  ul
    list-style: none
</style>

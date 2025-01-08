<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Button from 'tint/components/Button.svelte'
  import Menu, {
    type ContextClickHandler,
    type MenuItem,
  } from 'tint/components/Menu.svelte'
  import TabbyIcon from '@src/assets/tabby-icon.svg?raw'
  import TabbyNoResult from '@src/assets/cat_noresults.svg?raw'
  import iconDropdown from 'tint/icons/14-dropdown.svg?raw'
  import TabItem from '@src/components/TabItem.svelte'
  import tabs from '@src/utils/tab-store'
  import Fuse from 'fuse.js'
  import fuseHighlight, { type HighlightResult } from './utils/fuse-highlight'
  import * as extAPI from '@src/utils/extension-api'
  import { findGroups, type IndexInfo } from './utils/tab-utils'
  import tabGroups from '@src/utils/group-store'
  import stateStore from '@src/utils/state-store'
  import GroupItem from './components/GroupItem.svelte'
  import { tabActions } from './utils/tab-actions'
  import { onMount, untrack } from 'svelte'

  const INDEX_OPTIONS = { keys: ['title', 'url'], includeMatches: true }

  interface Props {
    ontogglepreferences?: () => void
  }

  let { ontogglepreferences = undefined }: Props = $props()

  let searchString = $state('')
  let fuse: Fuse<extAPI.CombinedTab> | null = $state(null)

  let contextClick: ContextClickHandler | undefined = $state(undefined)

  let focus: [number, number] = $state([-1, 0])
  let searchFieldFocus = $state(true)
  let searchField: HTMLInputElement | null = $state(null)
  let focusLeft = $state<() => void | undefined>()
  let focusRight = $state<() => void | undefined>()
  let searchResults = $state<HighlightResult<extAPI.CombinedTab>[]>([])
  let groupResults = $state<
    ReturnType<typeof findGroups<HighlightResult<extAPI.CombinedTab>>>
  >({
    groupIndices: [],
    totalIndices: 0,
    activeTabIndex: 0,
  })

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

  $effect(() => {
    updateFuseInstance($tabs)
    // stringify and parse fuse and log it
    if (
      searchString === undefined ||
      $tabs === undefined ||
      fuse === null ||
      $stateStore.preferences === undefined ||
      $tabGroups === undefined
    )
      return

    untrack(async () => {
      searchResults = searchTabs(
        $tabs,
        searchString,
        fuse,
        $stateStore.preferences?.showOverview || false,
      )
      groupResults = findGroups(
        searchResults,
        $tabGroups,
        searchString.trim().length > 0 ||
          !$stateStore.preferences?.showGroupTabs,
      )
      onUpdateListItems(groupResults.groupIndices)
    })
  })

  let localizedTabActions = $derived.by<MenuItem[]>(() => {
    return tabActions.map((item) => {
      if (typeof item === 'object' && 'label' in item) {
        const obj: any = {
          ...item,
          label: $_(item.label),
        }
        if ('items' in item) {
          obj.items = item.items.map((subItem) => {
            if (typeof subItem === 'object' && 'label' in subItem) {
              return {
                ...subItem,
                label: $_(subItem.label),
              }
            }
            return subItem
          })
        }
        return obj
      }
      return item
    })
  })

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
      focusLeft?.()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      searchFieldFocus = false
      focusRight?.()
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

  function handleFocusChange(index: number) {
    if (index === undefined || index === -1) {
      changeFocus(0)
    } else {
      focus = [index, 0]
      changeFocus(0)
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="tint--tinted">
  <Button
    icon={true}
    variant="ghost"
    title={$_('preferences-button')}
    onclick={ontogglepreferences}>{@html TabbyIcon}</Button
  >
  <input
    type="search"
    placeholder={$_('search-input.placeholder')}
    aria-label={$_('search-input.aria-label')}
    spellcheck="false"
    class="tint--type-body-sans"
    bind:value={searchString}
    bind:this={searchField}
    onfocus={() => (searchFieldFocus = true)}
    onblur={() => (searchFieldFocus = false)}
    onkeydown={handleInputKeydown}
  />
  <button
    class="tabs"
    onclick={contextClick}
    onmousedown={contextClick}
    title={$_('search-tab-counter', { values: { n: 12 } })}
  >
    <span>{$tabs.length}</span>
    {@html iconDropdown}
  </button>
  <Menu variant="button" items={localizedTabActions} bind:contextClick />
</header>

<!-- if search term and no results -->
{#if searchString.trim().length > 0 && searchResults.length === 0}
  <div class="no-result tint--tinted">
    {@html TabbyNoResult}
    <h2 class="tint--type-title-sans-3">{$_('search-no-result')}</h2>
  </div>
{:else}
  <div class="main-area" tabindex="-1">
    {#each groupResults.groupIndices as item}
      {#if item.type === 'group'}
        <GroupItem
          groupId={item.groupId}
          bind:focus
          onactionat={handleFocusChange}
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
              onactionat={handleFocusChange}
              onfocusset={(index) => {
                if (index === 0) {
                  focus = [0, 0]
                  changeFocus(0)
                } else if (index === 1) {
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
{/if}

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

  .main-area, ul, .no-result
    display: flex
    flex-direction: column
  ul
    list-style: none

  .no-result
    justify-content: center
    align-items: center
    height: 100%
    flex-grow: 1
    gap: tint.$size-16
</style>

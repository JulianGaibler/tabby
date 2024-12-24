<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Button from 'tint/components/Button.svelte'
  import BackIcon from 'tint/icons/20-chevron-left.svg?raw'
  import { createEventDispatcher } from 'svelte'
  import { hasContainerSupport, hasTabGroupSupport, shortcutGet } from '@src/utils/extension-api'
  import Shortcut from '@src/components/preferences/Shortcut.svelte'
  import Language from '@src/components/preferences/Language.svelte'
  import ShowTabGroups from '@src/components/preferences/ShowTabGroups.svelte'
  import ShowTabContainers from '@src/components/preferences/ShowTabContainers.svelte'
  import Theme from '@src/components/preferences/Theme.svelte'
  import ShowOverview from '@src/components/preferences/ShowOverview.svelte'
  import GLogo from '@src/assets/g-logo.svg?raw'
  import ShareAndSupport from './components/preferences/ShareAndSupport.svelte'
  const dispatch = createEventDispatcher()
  const VERSION = __VERSION__

  let shortcut = ''
  shortcutGet('_execute_browser_action').then((result) => {
    shortcut = result || ''
  })
</script>

<header class="tint--tinted">
  <Button
    icon={true}
    variant="ghost"
    title={$_('back-button')}
    on:click={() => dispatch('toggle-preferences')}>{@html BackIcon}</Button
  >
  <h1 class="tint--type-body-sans">{$_('preferences-header')}</h1>
</header>

<main class="main-area tint--tinted">
  <div class="grid">
    <Shortcut />
    <Language />
    <Theme />
    <ShowOverview />
    {#if hasTabGroupSupport}
    <ShowTabGroups />
    {/if}
    {#if hasContainerSupport}
    <ShowTabContainers />
    {/if}
    <ShareAndSupport />
  </div>
  <p class="credits">Made by <a href="https://jwels.berlin/" title="Julian Gaibler" target="_blank" rel="noopener">{@html GLogo}</a> in Berlin</p>
</main>

<footer class="infobar tint--tinted tint--type-ui-small">
  <p>tabby {VERSION}</p>
  <p>Source Code</p>
</footer>

<style lang="sass">
  .grid
    padding-block: tint.$size-24
    padding-inline: tint.$size-64 + tint.$size-4
    display: grid
    grid-template-columns: 4fr 3fr
    gap: tint.$size-24
    :global(p)
      color: var(--tint-text-secondary)
    > :global(.controls)
      display: flex
      flex-direction: column
      justify-content: center
      gap: tint.$size-8
    > :global(.controls.end)
      align-items: flex-end

  footer
    color: var(--tint-text-secondary)
    > p:last-child
      text-align: end

  .credits
    padding-block-end: tint.$size-24
    padding-inline: tint.$size-64 + tint.$size-4
    display: flex
    align-items: center
    justify-content: center
    a
      text-decoration: none
      line-height: 0
      margin-inline: tint.$size-2
      &:hover
        color: var(--tint-text-link)
    :global(svg)
      height: tint.$size-24
      width: tint.$size-24
</style>

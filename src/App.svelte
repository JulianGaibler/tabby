<script lang="ts">
  import Preferences from '@src/Preferences.svelte'
  import Search from '@src/Search.svelte'

  let showPreferences = false
</script>

<div id="app" class="tint--type-ui tint--plain">
  {#if showPreferences}
    <Preferences on:toggle-preferences={() => (showPreferences = false)} />
  {:else}
    <Search on:toggle-preferences={() => (showPreferences = true)} />
  {/if}
</div>

<style lang="sass">
  #app
    max-height: 500px
    display: flex
    flex-direction: column
    background: var(--tint-bg)
    color: var(--tint-text)
    flex-grow: 1
    > :global(header)
      padding: tint.$size-4 tint.$size-8
      gap: tint.$size-12
      align-items: center
      display: flex
      background: var(--tint-bg)
      border-bottom: 1px solid var(--tint-input-bg)
      flex-shrink: 0
    > :global(.main-area)
      flex-grow: 1
      overflow-x: auto
      background: var(--tint-bg)
    > :global(.infobar)
      padding: tint.$size-4 tint.$size-8
      gap: tint.$size-12
      align-items: center
      display: flex
      background: var(--tint-input-bg)
      flex-shrink: 0
    > :global(.infobar > *)
      flex-grow: 1
</style>

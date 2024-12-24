<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Select from 'tint/components/Select.svelte'
  import state from '@src/utils/state-store'

  $: items = [
    {
      value: 'system',
      label: $_('theme-system'),
    },
    {
      value: 'light',
      label: $_('theme-light'),
    },
    {
      value: 'dark',
      label: $_('theme-dark'),
    },
  ]

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    if (!items.map((item) => item.value).includes(value)) return
    state.setPreferences('theme', value as 'system' | 'light' | 'dark')
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-theme-headline')}</h2>
  <p id="locale-description">{$_('preferences-theme-explanation')}</p>
</div>
<div class="controls"><Select
  id="input"
  ariaDescribedby="locale-description"
  {items}
  label={$_('preferences-theme-headline')}
  value={$state.preferences?.theme}
  on:change={handleChange}
/></div>

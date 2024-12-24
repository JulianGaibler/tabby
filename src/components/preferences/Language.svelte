<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Select from 'tint/components/Select.svelte'
  import { availableLocales } from 'virtual:available-locales'
  import state from '@src/utils/state-store'
  import LocalizedWithLink from '@src/components/LocalizedWithLink.svelte'

  $: items = [
    {
      value: 'system',
      label: $_('language-system'),
    }
  ].concat(
    availableLocales.map((locale) => ({
    value: locale,
    label: $_(`language-name-${locale}`),
  }))
  )

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    state.setPreferences('locale', value)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-language-headline')}</h2>
  <p id="locale-description"><LocalizedWithLink id="preferences-language-contribute" url="#" /></p>
</div>
<div class="controls"><Select
  id="input"
  ariaDescribedby="locale-description"
  {items}
  label={$_('preferences-language-headline')}
  value={$state.preferences?.locale}
  on:change={handleChange}
/></div>

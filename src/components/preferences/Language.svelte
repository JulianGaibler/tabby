<script lang="ts">
  import LocalizedWithLink from '@src/components/LocalizedWithLink.svelte'
  import stateStore from '@src/utils/state-store'
  import { _ } from 'svelte-i18n'
  import Select from 'tint/components/Select.svelte'
  import { availableLocales } from 'virtual:available-locales'

  let items = $derived(
    [
      {
        value: 'system',
        label: $_('language-system'),
      },
    ].concat(
      availableLocales.map((locale) => ({
        value: locale,
        label: $_(`language-name-${locale}`),
      })),
    ),
  )

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    stateStore.setPreferences('locale', value)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-language-headline')}</h2>
  <p id="locale-description">
    <LocalizedWithLink id="preferences-language-contribute" url="#" />
  </p>
</div>
<div class="controls">
  <Select
    id="input"
    ariaDescribedby="locale-description"
    {items}
    label={$_('preferences-language-headline')}
    value={$stateStore.preferences?.locale}
    onchange={handleChange}
  />
</div>

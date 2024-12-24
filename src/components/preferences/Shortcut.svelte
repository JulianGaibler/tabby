<script lang="ts">
  import { _ } from 'svelte-i18n'
  import TextField from 'tint/components/TextField.svelte'
  import { shortcutGet } from '@src/utils/extension-api'
  import LocalizedWithLink from '../LocalizedWithLink.svelte'

  let shortcut = '-/-'
  shortcutGet('_execute_browser_action').then((result) => {
    shortcut = result || ''
  })
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-shortcut-headline')}</h2>
  <p id="locale-description"><LocalizedWithLink id="preferences-shortcut-explanation" url="#" /></p>
</div>
<div class="controls"><TextField
  id="input"
  label={$_('preferences-shortcut-headline')}
  value={shortcut}
  disabled
/></div>

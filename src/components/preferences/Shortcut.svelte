<script lang="ts">
  import LocalizedWithLink from '../LocalizedWithLink.svelte'
  import { shortcutGet } from '@src/utils/extension-api'
  import { _ } from 'svelte-i18n'
  import TextField from 'tint/components/TextField.svelte'

  let shortcut = $state('-/-')
  shortcutGet('_execute_action').then((result) => {
    shortcut = result || ''
  })

  const IS_FIREFOX = navigator.userAgent.includes('Firefox')
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-shortcut-headline')}</h2>
  <p id="locale-description">
    <LocalizedWithLink
      id="preferences-shortcut-explanation"
      url={IS_FIREFOX
        ? $_('url-changing-shortcuts-firefox')
        : $_('url-changing-shortcuts-chrome')}
    />
  </p>
</div>
<div class="controls">
  <TextField
    id="input"
    label={$_('preferences-shortcut-headline')}
    value={shortcut || '-/-'}
    disabled
  />
</div>

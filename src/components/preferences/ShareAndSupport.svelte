<script lang="ts">
  import stateStore from '@src/utils/state-store'
  import { _ } from 'svelte-i18n'
  import Button from 'tint/components/Button.svelte'
  import Toggleable from 'tint/components/Toggleable.svelte'
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-recommend-headline')}</h2>
  <p id="locale-description">{$_('preferences-recommend-explanation')}</p>
</div>
<div class="controls end">
  <Button small>{$_('preferences-recommend-action')}</Button>
</div>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-support-headline')}</h2>
  <p id="locale-description">{$_('preferences-support-explanation')}</p>
</div>
<div class="controls end">
  <Button small>{$_('preferences-support-action')}</Button>
</div>

<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Toggleable from 'tint/components/Toggleable.svelte'
  import state from '@src/utils/state-store'
  import Button from 'tint/components/Button.svelte'

</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-recommend-headline')}</h2>
  <p id="locale-description">test</p>
</div>
<div class="controls end">
  <Button small>Rate addon</Button>
</div>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-recommend-headline')}</h2>
  <p id="locale-description">test</p>
</div>
<div class="controls end">
  <Button small>Support page</Button>
</div>

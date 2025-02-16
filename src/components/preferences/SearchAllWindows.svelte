<script lang="ts">
  import stateStore from '@src/utils/state-store'
  import { _ } from 'svelte-i18n'
  import Toggleable from 'tint/components/Toggleable.svelte'

  function handleChange(s: boolean) {
    stateStore.setPreferences('searchAllWindows', s)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">
    {$_('preferences-search-all-windows-headline')}
  </h2>
  <p id="all-windows-description">
    {$_('preferences-search-all-windows-explanation')}
  </p>
</div>
<div class="controls end">
  <Toggleable
    checked={!!$stateStore.preferences?.searchAllWindows}
    onchange={handleChange}
    ariaDescribedby="all-windows-description"
    id="input"
    type="switch"
  />
</div>

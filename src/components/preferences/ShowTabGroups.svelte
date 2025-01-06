<script lang="ts">
  import stateStore from '@src/utils/state-store'
  import { _ } from 'svelte-i18n'
  import Toggleable from 'tint/components/Toggleable.svelte'

  function handleChange(s: boolean) {
    stateStore.setPreferences('showGroupTabs', s)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">
    {$_('preferences-show-tab-groups-headline')}
  </h2>
  <p id="overview-description">
    {$_('preferences-show-tab-groups-explanation')}
  </p>
</div>
<div class="controls end">
  <Toggleable
    checked={!!$stateStore.preferences?.showGroupTabs}
    onchange={handleChange}
    ariaDescribedby="overview-description"
    id="input"
    type="switch"
  />
</div>

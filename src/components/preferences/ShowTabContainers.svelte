<script lang="ts">
  import stateStore from '@src/utils/state-store'
  import { _ } from 'svelte-i18n'
  import Toggleable from 'tint/components/Toggleable.svelte'

  function handleChange(s: boolean) {
    stateStore.setPreferences('showContainerTabs', s)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">
    {$_('preferences-show-tab-containers-headline')}
  </h2>
  <p id="overview-description">
    {$_('preferences-show-tab-containers-explanation')}
  </p>
</div>
<div class="controls end">
  <Toggleable
    checked={!!$stateStore.preferences?.showContainerTabs}
    onchange={handleChange}
    ariaDescribedby="overview-description"
    id="input"
    type="switch"
  />
</div>

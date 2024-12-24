<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Toggleable from 'tint/components/Toggleable.svelte'
  import state from '@src/utils/state-store'

  function handleChange(event: CustomEvent<boolean>) {
    state.setPreferences('showContainerTabs', event.detail)
  }
</script>

<div>
  <h2 class="tint--type-ui-bold">{$_('preferences-show-tab-containers-headline')}</h2>
  <p id="overview-description">{$_('preferences-show-tab-containers-explanation')}</p>
</div>
<div class="controls end">
  <Toggleable
    checked={!!$state.preferences?.showContainerTabs}
    on:change={handleChange}
    ariaDescribedby="overview-description"
    id="input"
    type="switch"
  />
</div>

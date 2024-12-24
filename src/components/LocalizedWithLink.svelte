<script lang="ts">
  import { _ } from 'svelte-i18n'

  export let id: string
  export let url: string

  function wrapInLink(id: string, url: string) {
    return `<a href="${url}" target="_blank" rel="noopener">${$_(`${id}.url`)}</a>`
  }

  $: wrappedUrl = wrapInLink(id, url)
</script>

{@html $_(`${id}.message`, { values: { '0': wrappedUrl } })}

<script lang="ts">
  import { _ } from 'svelte-i18n'

  interface Props {
    id: string
    url: string
  }

  let { id, url }: Props = $props()

  function wrapInLink(id: string, url: string) {
    return `<a href="${url}" target="_blank" rel="noopener">${$_(`${id}.url`)}</a>`
  }

  let wrappedUrl = $derived(wrapInLink(id, url))
</script>

{@html $_(`${id}.message`, { values: { '0': wrappedUrl } })}

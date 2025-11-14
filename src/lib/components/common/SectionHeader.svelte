<script lang="ts">
  interface Props {
    titulo: string
    contador?: number
    accent?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'
  }
  let { titulo, contador = undefined, accent = 'neutral' }: Props = $props()
</script>

<header class="mb-2 flex items-center gap-2">
  <h2 class="text-xl font-semibold flex items-center gap-2">
    <slot name="icon" />
    {titulo}
    {#if typeof contador === 'number'}
      <span class="badge badge-outline" class:badge-primary={accent==='primary'} class:badge-secondary={accent==='secondary'} class:badge-info={accent==='info'} class:badge-success={accent==='success'} class:badge-warning={accent==='warning'} class:badge-error={accent==='error'} class:badge-neutral={accent==='neutral'}>{contador}</span>
    {/if}
  </h2>
  <div class="ml-auto">
    <slot name="actions" />
  </div>
</header>

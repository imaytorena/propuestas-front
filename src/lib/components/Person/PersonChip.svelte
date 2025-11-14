<script lang="ts">
  interface Props {
    nombre: string
    correo?: string
    inicial?: string
    avatarUrl?: string
    href?: string
    clickable?: boolean
    secundario?: string
  }
  let { nombre, correo = '', inicial = '', avatarUrl = '', href = '', clickable = false, secundario = '' }: Props = $props()
  let displayInicial = $derived(inicial || (nombre?.trim()?.charAt(0)?.toUpperCase() || 'U'))
</script>

<div class="flex items-center gap-3">
  {#if avatarUrl}
    <img src={avatarUrl} alt={nombre} class="h-8 w-8 rounded-full object-cover" />
  {:else}
    <div class="h-8 w-8 rounded-full bg-base-300 flex items-center justify-center font-semibold">
      {displayInicial}
    </div>
  {/if}
  <div class="min-w-0">
    {#if href && clickable}
      <a class="link link-hover font-medium truncate" href={href}>{nombre}</a>
    {:else}
      <div class="font-medium truncate">{nombre}</div>
    {/if}
    {#if correo || secundario}
      <div class="text-xs text-base-content/70 truncate">{secundario || correo}</div>
    {/if}
  </div>
</div>

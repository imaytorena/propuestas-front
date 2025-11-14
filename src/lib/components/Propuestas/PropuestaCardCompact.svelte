<script lang="ts">
  import StatusBadge from '../badges/StatusBadge.svelte'
  import { goto } from '../../../utils/nav'

  interface Props {
    id: string | number
    titulo: string
    hora?: string
    etiqueta?: string
    variante?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'neutral'
    accent?: 'success' | 'info' | 'neutral'
    hrefBase?: string
  }
  let { id, titulo, hora = '', etiqueta = '', variante = 'neutral', accent = 'neutral', hrefBase = '/propuestas' }: Props = $props()
  let href = $derived(`${hrefBase}/${id}`)
  let borderClase = $derived(accent === 'success' ? 'border-success/20' : accent === 'info' ? 'border-info/20' : 'border-base-300')
  let btnClase = $derived(accent === 'success' ? 'btn-success' : accent === 'info' ? 'btn-info' : 'btn-neutral')
</script>

<div class="card bg-base-100 border hover:shadow-md transition-shadow {borderClase}">
  <div class="card-body p-4">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h4 class="font-semibold text-base mb-1 truncate">{titulo}</h4>
        <div class="flex items-center gap-4 text-sm text-base-content/70">
          {#if hora}
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {hora}
            </span>
          {/if}
          {#if etiqueta}
            <StatusBadge etiqueta={etiqueta} variante={variante} size="sm" />
          {/if}
        </div>
      </div>
      <a class="btn btn-sm {btnClase}" href={href} onclick={goto}>
        Ver detalles
      </a>
    </div>
  </div>
</div>

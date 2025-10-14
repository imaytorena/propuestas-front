<script lang="ts">
  import { goto } from '../../utils/nav'

  interface Props {
    propuestas?: any[]
  }

  let { propuestas = [] }: Props = $props()

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function groupByDate(propuestas: any[]) {
    const grouped = propuestas.reduce((acc, propuesta) => {
      const date = propuesta.fechaActividad
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(propuesta)
      return acc
    }, {})
    
    return Object.entries(grouped).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
  }


</script>

<section class="space-y-6">
  <header>
    <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      Propuestas a las que asistiré
    </h2>
  </header>

  {#if propuestas.length === 0}
    <div class="text-center py-8 text-base-content/70">
      <p>No tienes propuestas suscritas</p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each groupByDate(propuestas) as [fecha, propuestasPorFecha]}
        <div class="space-y-3">
          <h3 class="text-lg font-medium text-primary capitalize">
            {formatDate(fecha)}
          </h3>
          <div class="space-y-2">
            {#each propuestasPorFecha as propuesta}
              <div class="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow">
                <div class="card-body p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-semibold text-base mb-1">
                        {propuesta.title ?? propuesta.titulo ?? `Propuesta ${propuesta.id}`}
                      </h4>
                      <div class="flex items-center gap-4 text-sm text-base-content/70">
                        {#if propuesta.horaActividad}
                          <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {propuesta.horaActividad}
                          </span>
                        {/if}
                        {#if propuesta.estatus}
                          <span class="badge badge-primary badge-sm">{propuesta.estatus}</span>
                        {/if}
                      </div>
                    </div>
                    <button 
                      class="btn btn-primary btn-sm"
                      onclick={() => window.location.href = `/propuestas/${propuesta.id}`}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
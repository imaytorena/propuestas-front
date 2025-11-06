<script lang="ts">
  import { goto } from '../../utils/nav'

  interface Props {
    propuestaIdsAsistire?: any[]
    propuestasInteres?: any[]
  }

  let { propuestaIdsAsistire = [], propuestasInteres = [] }: Props = $props()

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

  let asistire = $derived(propuestaIdsAsistire)
  let interesados = $derived(propuestasInteres)


</script>

<div class="space-y-8">
  <!-- Propuestas a las que asistiré -->
  <section class="space-y-6">
    <header>
      <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
        <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Propuestas a las que asistiré ({asistire.length})
      </h2>
    </header>

    {#if asistire.length === 0}
      <div class="text-center py-4 text-base-content/70">
        <p>No tienes propuestas confirmadas</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each groupByDate(asistire) as [fecha, propuestasPorFecha]}
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-success capitalize">
              {formatDate(fecha)}
            </h3>
            <div class="space-y-2">
              {#each propuestasPorFecha as propuesta}
                <div class="card bg-base-100 border border-success/20 hover:shadow-md transition-shadow">
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
                          <span class="badge badge-success badge-sm">Asistiré</span>
                        </div>
                      </div>
                      <button 
                        class="btn btn-success btn-sm"
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

  <!-- Propuestas que me interesan -->
  <section class="space-y-6">
    <header>
      <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
        <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        Propuestas que me interesan ({interesados.length})
      </h2>
    </header>

    {#if interesados.length === 0}
      <div class="text-center py-4 text-base-content/70">
        <p>No tienes propuestas marcadas como interesantes</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each groupByDate(interesados) as [fecha, propuestasPorFecha]}
          <div class="space-y-3">
            <div class="space-y-2">
              {#each propuestasPorFecha as propuesta}
                <div class="card bg-base-100 border border-info/20 hover:shadow-md transition-shadow">
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
                          <span class="badge badge-info badge-sm">Me interesa</span>
                        </div>
                      </div>
                      <button 
                        class="btn btn-info btn-sm"
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
</div>
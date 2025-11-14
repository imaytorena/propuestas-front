<script lang="ts">
  import SectionHeader from './common/SectionHeader.svelte'
  import PropuestaCardCompact from './Propuestas/PropuestaCardCompact.svelte'
  import { groupByDate } from '../../utils/date'

  interface Props {
    propuestaIdsAsistire?: any[]
    propuestasInteres?: any[]
  }

  let { propuestaIdsAsistire = [], propuestasInteres = [] }: Props = $props()

  let asistire = $derived(propuestaIdsAsistire)
  let interesados = $derived(propuestasInteres)

  const agrupar = (arr:any[]) => groupByDate(arr, (p:any) => p?.fechaActividad)
</script>

<div class="space-y-8">
  <!-- Propuestas a las que asistiré -->
  <section class="space-y-6">
    <SectionHeader titulo="Propuestas a las que asistiré" contador={asistire.length} accent="success">
      <svelte:fragment slot="icon">
        <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </svelte:fragment>
      {#key asistire}
        {@const contador = asistire.length}
      {/key}
    </SectionHeader>

    {#if asistire.length === 0}
      <div class="text-center py-4 text-base-content/70">
        <p>No tienes propuestas confirmadas</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each agrupar(asistire) as [fecha, propuestasPorFecha]}
          <div class="space-y-2">
            {#each propuestasPorFecha as p}
              <PropuestaCardCompact
                id={p.id}
                titulo={p.title ?? p.titulo ?? `Propuesta ${p.id}`}
                hora={p.horaActividad}
                etiqueta="Asistiré"
                variante="success"
                accent="success"
              />
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Propuestas que me interesan -->
  <section class="space-y-6">
    <SectionHeader titulo="Propuestas que me interesan" contador={interesados.length} accent="info">
      <svelte:fragment slot="icon">
        <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </svelte:fragment>
      {#key interesados}
        {@const contador = interesados.length}
      {/key}
    </SectionHeader>

    {#if interesados.length === 0}
      <div class="text-center py-4 text-base-content/70">
        <p>No tienes propuestas marcadas como interesantes</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each agrupar(interesados) as [fecha, propuestasPorFecha]}
          <div class="space-y-2">
            {#each propuestasPorFecha as p}
              <PropuestaCardCompact
                id={p.id}
                titulo={p.title ?? p.titulo ?? `Propuesta ${p.id}`}
                hora={p.horaActividad}
                etiqueta="Me interesa"
                variante="info"
                accent="info"
              />
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
<script lang="ts">
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  let propuestaId: string = ''
  let loading = $state(true)
  let error: string | null = $state(null)
  let propuesta: any = $state(null)

  async function loadPropuesta() {
    if (!propuestaId) return
    loading = true
    error = null
    try {
      const { data } = await api.get(`/propuestas/${propuestaId}`)
      propuesta = data
    } catch (e: any) {
      error = e?.message ?? 'Error cargando propuesta'
    } finally {
      loading = false
    }
  }

  $effect(() => {
    const id = $route.params.propuestaId
    if (id !== propuestaId) {
      propuestaId = id
      loadPropuesta()
    }
  })
</script>

<section aria-labelledby="propuesta-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
  {#if loading}
    <article class="card bg-base-100 shadow-sm">
      <div class="card-body animate-pulse">
        <div class="h-6 w-2/3 rounded bg-base-200"></div>
        <div class="mt-3 h-4 w-full rounded bg-base-200"></div>
        <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
        <div class="mt-6 h-9 w-32 rounded bg-base-200"></div>
      </div>
    </article>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
      <div class="ml-auto">
        <button class="btn btn-sm" onclick={loadPropuesta}>Reintentar</button>
      </div>
    </div>
  {:else if !propuesta}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Propuesta no encontrada.</p>
      <a class="btn" href="/propuestas" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-6">
      <div class="flex items-center justify-between gap-3 mb-3">
        <h1 id="propuesta-heading" class="text-2xl font-semibold tracking-tight">
          {propuesta.title ?? propuesta.titulo ?? `Propuesta ${propuestaId}`}
        </h1>
        <nav class="flex items-center gap-2">
          <a
            class="btn btn-primary btn-sm text-white"
            href={`/propuestas/${propuestaId}/editar`}
            onclick={goto}
            aria-label="Editar propuesta"
          >Editar</a>
          <a class="btn btn-ghost btn-sm" href="/propuestas" onclick={goto}>Volver</a>
        </nav>
      </div>
      
      <div class="flex items-center gap-4 text-sm text-base-content/70">
        {#if propuesta.creador || propuesta.autor || propuesta.usuario}
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Creado por: <span class="font-medium text-base-content">{propuesta.creador?.identificador}</span></span>
          </div>
        {/if}
      </div>
    </header>

    <article class="prose max-w-none mb-6">
      {#if (propuesta.description ?? propuesta.descripcion)}
        <p>{propuesta.description ?? propuesta.descripcion}</p>
      {:else}
        <p class="text-base-content/70">Sin descripción.</p>
      {/if}
    </article>

    {#if propuesta.actividades && propuesta.actividades.length > 0}
      <section class="mt-8">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
          Actividades a realizar
        </h2>
        <div class="grid gap-4">
          {#each propuesta.actividades as actividad, index}
            <div class="card bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg mb-2 text-primary">{actividad.nombre}</h3>
                    <p class="text-base-content/80 leading-relaxed">{actividad.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  {/if}
</section>

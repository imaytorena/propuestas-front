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
    <header class="mb-3 flex items-center justify-between gap-3">
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
    </header>

    <article class="prose max-w-none">
      {#if (propuesta.description ?? propuesta.descripcion)}
        <p>{propuesta.description ?? propuesta.descripcion}</p>
      {:else}
        <p class="text-base-content/70">Sin descripción.</p>
      {/if}
    </article>
  {/if}
</section>

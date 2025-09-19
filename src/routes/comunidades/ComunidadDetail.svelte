<script lang="ts">
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  let comunidadId: string = ''
  let loading = $state(true)
  let error: string | null = $state(null)
  let comunidad: any = $state(null)

  async function loadComunidad() {
    if (!comunidadId) return
    loading = true
    error = null
    try {
      const { data } = await api.get(`/comunidades/${comunidadId}`)
      comunidad = data
    } catch (e: any) {
      error = e?.message ?? 'Error cargando comunidad'
    } finally {
      loading = false
    }
  }

  // Mantener comunidadId sincronizado con la ruta y recargar al cambiar
  $effect(() => {
    const id = $route.params.comunidadId
    if (id !== comunidadId) {
      comunidadId = id
      loadComunidad()
    }
  })
</script>

<section aria-labelledby="comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
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
        <button class="btn btn-sm" onclick={loadComunidad}>Reintentar</button>
      </div>
    </div>
  {:else if !comunidad}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Comunidad no encontrada.</p>
      <a class="btn" href="/comunidades" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-3 flex items-center justify-between gap-3">
      <h1 id="comunidad-heading" class="text-2xl font-semibold tracking-tight">
        {comunidad.nombre ?? `Comunidad ${comunidadId}`}
      </h1>
      <nav class="flex items-center gap-2">
        <a
          class="btn btn-primary btn-sm text-white"
          href={`/comunidades/${comunidadId}/editar`}
          onclick={goto}
          aria-label="Editar comunidad"
        >Editar</a>
        <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Volver</a>
      </nav>
    </header>

    <article class="prose max-w-none">
      {#if comunidad.descripcion}
        <p>{comunidad.descripcion}</p>
      {:else}
        <p class="text-base-content/70">Sin descripción.</p>
      {/if}
    </article>
  {/if}
</section>

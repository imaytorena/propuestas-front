<script lang="ts">
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  type Propuesta = {
    id: number | string
    title?: string
    titulo?: string
    descripcion?: string
    description?: string
    comunidad?: { nombre: string }
  }

  let propuestas: Propuesta[] = $state([])
  let loading = $state(true)
  let error: string | null = $state(null)
  let query: string = $state('')

  // Paginación (cliente)
  let page = $state(1)
  let pageSize = $state(9)

  async function loadPropuestas() {
    loading = true
    error = null
    try {
      const { data } = await api.get(`/propuestas`)
      propuestas = data.data ?? data.items ?? data.propuestas ?? data ?? []
    } catch (e: any) {
      error = e?.message ?? 'Error cargando propuestas'
    } finally {
      loading = false
    }
  }

  const filtered = $derived((propuestas ?? []).filter((p) => {
    if (!query) return true
    const q = query.toLowerCase().trim()
    return (
      (p.title ?? p.titulo ?? '').toLowerCase().includes(q) ||
      (p.description ?? p.descripcion ?? '').toLowerCase().includes(q) ||
      (p.comunidad?.nombre ?? '').toLowerCase().includes(q)
    )
  }))

  const totalItems = $derived(filtered.length)
  const totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)))
  const startIndex = $derived((page - 1) * pageSize)
  const endIndex = $derived(Math.min(startIndex + pageSize, totalItems))
  const pageItems = $derived(filtered.slice(startIndex, startIndex + pageSize))

  $effect(() => {
    if (page > totalPages) page = totalPages
    if (page < 1) page = 1
  })

  $effect(() => {
    void query
    page = 1
  })

  $effect.pre(() => {
    loadPropuestas()
  })
</script>

<section aria-labelledby="propuestas-heading" class="mx-auto max-w-6xl px-4 py-4 sm:py-6">
  <header class="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
    <h1 id="propuestas-heading" class="text-2xl font-semibold tracking-tight">Propuestas</h1>

    <div class="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div class="join w-full sm:w-80">
        <input
          class="input input-bordered join-item w-full"
          type="search"
          placeholder="Buscar propuestas..."
          aria-label="Buscar propuestas"
          bind:value={query}
        />
        {#if query}
          <button class="btn join-item" aria-label="Limpiar búsqueda" onclick={() => (query = '')}>✕</button>
        {/if}
      </div>
      <a class="btn btn-primary text-white" href="/propuestas/crear" onclick={goto}>Nueva propuesta</a>
      <button class="btn btn-ghost" onclick={loadPropuestas} aria-label="Recargar lista">Recargar</button>
    </div>
  </header>

  {#if loading}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _, idx}
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body animate-pulse">
            <div class="h-5 w-2/3 rounded bg-base-200"></div>
            <div class="mt-2 h-4 w-full rounded bg-base-200"></div>
            <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
            <div class="mt-4 h-9 w-28 rounded bg-base-200"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
      <div class="ml-auto">
        <button class="btn btn-sm" onclick={loadPropuestas}>Reintentar</button>
      </div>
    </div>
  {:else if (propuestas?.length ?? 0) === 0}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Aún no hay propuestas.</p>
      <p class="text-base-content/70">Crea la primera.</p>
    </div>
  {:else if filtered.length === 0}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">No se encontraron resultados para "{query}".</p>
      <button class="btn" onclick={() => (query = '')}>Limpiar búsqueda</button>
    </div>
  {:else}
    <p class="mb-3 text-sm text-base-content/70">Mostrando {totalItems === 0 ? 0 : startIndex + 1}–{endIndex}
      de {totalItems}</p>
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each pageItems as p}
        <li>
          <article class="card bg-base-100 shadow-sm h-full">
            <div class="card-body flex flex-col">
              <h2 class="card-title text-base">{p.title ?? p.titulo ?? `Propuesta ${p.id}`}</h2>
              {#if (p.description ?? p.descripcion)}
                <p class="line-clamp-3 text-sm text-base-content/80">{p.description ?? p.descripcion}</p>
              {/if}
              <div class="card-actions mt-auto justify-end">
                <a
                  class="btn btn-primary btn-sm text-white"
                  href={`/propuestas/${p.id}`}
                  onclick={goto}
                  aria-label={`Ver detalles de ${p.title ?? p.titulo ?? `Propuesta ${p.id}`}`}
                >
                  Ver detalle
                </a>
              </div>
            </div>
          </article>
        </li>
      {/each}
    </ul>

    <nav class="mt-6 flex items-center justify-center" role="navigation" aria-label="Paginación">
      <div class="join">
        <button class="btn btn-sm join-item" aria-label="Página anterior" disabled={page === 1}
          onclick={() => (page = Math.max(1, page - 1))}>«
        </button>
        {#each Array(totalPages) as _, i}
          <button
            class="btn btn-sm join-item"
            class:btn-active={page === i + 1}
            aria-current={page === i + 1 ? 'page' : undefined}
            aria-label={`Ir a la página ${i + 1}`}
            onclick={() => (page = i + 1)}
          >{i + 1}</button>
        {/each}
        <button class="btn btn-sm join-item" aria-label="Siguiente página" disabled={page === totalPages}
          onclick={() => (page = Math.min(totalPages, page + 1))}>»
        </button>
      </div>
    </nav>
  {/if}
</section>

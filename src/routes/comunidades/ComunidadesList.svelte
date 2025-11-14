<script lang="ts">
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'

    type Comunidad = {
        id: number | string
        nombre?: string
        descripcion?: string
    }

    let comunidades: Comunidad[] = $state([])
    let loading = $state(true)
    let error: string | null = $state(null)
    let query: string = $state('')

    // Paginación (servidor)
    let page = $state(1)
    let pageSize = $state(12)
    let total = $state(0)
    let pageCount = $state(1)

    async function loadComunidades() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/comunidades`)
            comunidades = data ?? []
        } catch (e: any) {
            error = e?.message ?? 'Error cargando comunidades'
        } finally {
            loading = false
        }
    }

    // Paginación local completa
    const filtered = $derived((comunidades ?? []).filter((c) => {
        if (!query) return true
        const q = query.toLowerCase().trim()
        return (
            (c.nombre ?? '').toLowerCase().includes(q) ||
            (c.descripcion ?? '').toLowerCase().includes(q)
        )
    }))

    const totalItems = $derived(filtered.length)
    const totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)))
    const visiblePages = $derived((() => {
        const maxVisible = 8
        if (totalPages <= maxVisible) return Array.from({length: totalPages}, (_, i) => i + 1)
        const start = Math.max(1, Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1))
        return Array.from({length: maxVisible}, (_, i) => start + i)
    })())
    const startIndex = $derived((totalItems === 0) ? 0 : (page - 1) * pageSize)
    const endIndex = $derived(Math.min(page * pageSize, totalItems))
    const pageItems = $derived(filtered.slice(startIndex, endIndex))

    // Cambiar página dentro de los límites disponibles
    $effect(() => {
        if (page > totalPages) page = totalPages
        if (page < 1) page = 1
    })

    // Resetear a la primera página cuando cambia la búsqueda
    $effect(() => {
        void query
        page = 1
    })

    // Cargar datos solo una vez
    $effect.pre(() => {
        loadComunidades()
    })
</script>

<section aria-labelledby="comunidades-heading" class="mx-auto max-w-6xl px-4 py-4 sm:py-6">
    <header class="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <h1 id="comunidades-heading" class="text-2xl font-semibold tracking-tight">Comunidades</h1>

        <div class="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div class="join w-full sm:w-80">
                <input
                        class="input input-bordered join-item w-full"
                        type="search"
                        placeholder="Buscar comunidades..."
                        aria-label="Buscar comunidades"
                        bind:value={query}
                />
                {#if query}
                    <button class="btn join-item" aria-label="Limpiar búsqueda" onclick={() => (query = '')}>✕</button>
                {/if}
            </div>
            <a class="btn btn-primary text-white" href="/comunidades/crear" onclick={goto}>Nueva comunidad</a>
            <button class="btn btn-ghost" onclick={loadComunidades} aria-label="Recargar lista">Recargar</button>
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
                <button class="btn btn-sm" onclick={loadComunidades}>Reintentar</button>
            </div>
        </div>
    {:else if (comunidades?.length ?? 0) === 0}
        <div class="rounded-box border border-base-300 p-8 text-center">
            <p class="mb-2 text-lg">Aún no hay comunidades.</p>
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
            {#each pageItems as c}
                <li>
                    <article class="card bg-base-100 shadow-sm h-full">
                        <div class="card-body flex flex-col">
                            <h2 class="card-title text-base">{c.nombre ?? `Comunidad ${c.id}`}</h2>
                            {#if c.descripcion}
                                <p class="line-clamp-3 text-sm text-base-content/80">{c.descripcion}</p>
                            {/if}
                            <div class="card-actions mt-auto justify-end">
                                <a
                                        class="btn btn-primary btn-sm text-white"
                                        href={`/comunidades/${c.id}`}
                                        onclick={goto}
                                        aria-label={`Ver detalles de ${c.nombre ?? `Comunidad ${c.id}`}`}
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
                <button class="btn btn-sm join-item" aria-label="Primera página" disabled={page === 1}
                        onclick={() => (page = 1)}>««
                </button>
                <button class="btn btn-sm join-item" aria-label="Página anterior" disabled={page === 1}
                        onclick={() => (page = Math.max(1, page - 1))}>«
                </button>
                {#each visiblePages as pageNum}
                    <button
                            class="btn btn-sm join-item"
                            class:btn-active={page === pageNum}
                            aria-current={page === pageNum ? 'page' : undefined}
                            aria-label={`Ir a la página ${pageNum}`}
                            onclick={() => (page = pageNum)}
                    >{pageNum}</button>
                {/each}
                <button class="btn btn-sm join-item" aria-label="Siguiente página" disabled={page === totalPages}
                        onclick={() => (page = Math.min(totalPages, page + 1))}>»
                </button>
                <button class="btn btn-sm join-item" aria-label="Última página" disabled={page === totalPages}
                        onclick={() => (page = totalPages)}>»»
                </button>
            </div>
        </nav>
    {/if}
</section>

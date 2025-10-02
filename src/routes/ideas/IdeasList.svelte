<script lang="ts">
    import {goto} from '../../utils/nav'
    import api from "../../utils/api";

    type Idea = {
        id: number | string
        descripcion?: string
        comunidad?: {
            nombre: string
        }
    }

    let ideas: Idea[] = $state([])
    let loading = $state(true)
    let error: string | null = $state(null)
    let query: string = $state('')

    // Paginación (cliente)
    let page = $state(1)
    let pageSize = $state(9)

    async function loadIdeas() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/ideas`)
            // Permitir array directo o envuelto {items: []} / {ideas: []}
            ideas = data.data
        } catch (e: any) {
            error = e?.message ?? 'Error cargando ideas'
        } finally {
            loading = false
        }
    }

    const filtered = $derived((ideas ?? []).filter((i) => {
        if (!query) return true
        const q = query.toLowerCase().trim()
        return (
            (i.descripcion ?? '').toLowerCase().includes(q) ||
            (i.comunidad?.nombre ?? '').toLowerCase().includes(q)
        )
    }))

    // Derivados de paginación
    const totalItems = $derived(filtered.length)
    const totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)))
    const startIndex = $derived((page - 1) * pageSize)
    const endIndex = $derived(Math.min(startIndex + pageSize, totalItems))
    const pageItems = $derived(filtered.slice(startIndex, startIndex + pageSize))

    // Mantener página dentro de rangos cuando cambie el filtro o el tamaño de página
    $effect(() => {
        if (page > totalPages) page = totalPages
        if (page < 1) page = 1
    })

    // Reiniciar a la primera página cuando cambie la búsqueda
    $effect(() => {
        // Solo para usar la dependencia: query
        void query
        page = 1
    })

    $effect.pre(() => {
        // Ejecutar una vez al montar
        loadIdeas()
    })
</script>

<section aria-labelledby="ideas-heading" class="mx-auto max-w-6xl px-4 py-4 sm:py-6">
    <header class="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <h1 id="ideas-heading" class="text-2xl font-semibold tracking-tight">Ideas</h1>

        <div class="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div class="join w-full sm:w-80">
                <input
                        class="input input-bordered join-item w-full"
                        type="search"
                        placeholder="Buscar ideas..."
                        aria-label="Buscar ideas"
                        bind:value={query}
                />
                {#if query}
                    <button class="btn join-item" aria-label="Limpiar búsqueda" onclick={() => (query = '')}>✕</button>
                {/if}
            </div>
            <button class="btn btn-ghost" onclick={loadIdeas} aria-label="Recargar lista">Recargar</button>
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
                <button class="btn btn-sm" onclick={loadIdeas}>Reintentar</button>
            </div>
        </div>
    {:else if (ideas?.length ?? 0) === 0}
        <div class="rounded-box border border-base-300 p-8 text-center">
            <p class="mb-2 text-lg">Aún no hay ideas.</p>
            <p class="text-base-content/70">Sé el primero en compartir una.</p>
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
            {#each pageItems as idea}
                <li>
                    <article class="card bg-base-100 shadow-sm h-full">
                        <div class="card-body flex flex-col">
                            <h3 class="card-title text-lg">{idea.titulo ?? `Idea ${idea.id}`}</h3>
                            <p class="text-sm text-base-content/70">{idea.descripcion ?? `Idea ${idea.id}`}</p>
                            {#if idea.comunidad}
                                <p class="line-clamp-3 text-sm text-base-content/80">{idea.comunidad.nombre}</p>
                            {/if}
                            <div class="card-actions mt-auto justify-end">
                                <a
                                        class="btn btn-primary btn-sm text-white"
                                        href={`/ideas/${idea.id}`}
                                        onclick={goto}
                                        aria-label={`Ver detalles de ${idea.descripcion ?? `Idea ${idea.id}`}`}
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

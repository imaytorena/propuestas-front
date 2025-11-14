<script lang="ts">
    import {route} from '../../router'
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'
    import Map from '../../lib/components/Map.svelte'
    import {toPolygonFeatureFromAny} from '../../utils/geo'
    import { requireAuthClick } from '../../utils/authGuard'

    let comunidadId: string = $state('')
    let loading = $state(true)
    let error: string | null = $state(null)
    let comunidad: any = $state(null)

    // Usuario actual y membresía
    let joining = $state(false)
    let joinError: string | null = $state(null)
    // Flag explícita para mostrar el botón "Unirme" (si el backend la provee o si la calculamos aquí)
    let puedeUnirse: boolean = $state(false)
    let esMiembro = $state(false)
    let esCreador = $state(false)
    let miembros: any[] = $state([])
    // Propuestas relacionadas
    let propuestas: any[] = $state([])
    let loadingPropuestas = $state(false)
    let propuestasError: string | null = $state(null)

    // Miembros (para render detallado)
    let showAllMembers = $state(false)

    function normalizeMiembros(src: any): any[] {
        if (!src) return []
        if (Array.isArray(src)) return src
        if (typeof src === 'object') {
            return Object.values(src).filter(v => v && typeof v === 'object') as any[]
        }
        return []
    }

    import {getPersonaNombre, getPersonaCorreo, getInicial} from '../../utils/person'
    import {toYMD} from '../../utils/date'

    function miembroNombre(m: any): string {
        return getPersonaNombre(m)
    }

    function miembroCorreo(m: any): string {
        return getPersonaCorreo(m)
    }

    function miembroInicial(m: any): string {
        return getInicial(miembroNombre(m))
    }

    // GeoJSON features para el mapa (formato "antiguo" [[[lng,lat],...]])
    let features: any[] = $state([])

    // Convierte la comunidad a una lista de GeoJSON Features para Map.svelte (formato legacy)
    function comunidadToFeatures(c: any): any[] {
        if (!c) return []
        // Si ya viene como Feature(s), intenta usarlo
        if (Array.isArray(c?.features)) {
            return c.features
        }
        const feature = toPolygonFeatureFromAny(c, {
            id: c?.id ?? c?._id ?? '',
            nombre: c?.nombre ?? 'Comunidad',
            municipio: c?.municipio?.nombre ?? c?.municipio ?? ''
        })
        return feature ? [feature] : []
    }

    function getPolygonPointCount(fs: any[]): number {
        if (!Array.isArray(fs) || fs.length === 0) return 0
        const f = fs[0]
        const coords = f?.geometry?.type === 'Polygon' ? f.geometry.coordinates?.[0] : null
        return Array.isArray(coords) ? Math.max(0, coords.length - 1) : 0
    }

    function sameId(a: any, b: any): boolean {
        const ax = a?.id ?? a?._id ?? a
        const bx = b?.id ?? b?._id ?? b
        return String(ax ?? '') === String(bx ?? '')
    }

    async function joinCommunity() {
        if (!comunidadId) return
        joining = true
        joinError = null
        try {
            // Intento 1: endpoint join directo
            try {
                await api.post(`/comunidades/${comunidadId}/unirse`, {})
            } catch (e) {
                // Intento 2: crear miembro
                await api.post(`/comunidades/${comunidadId}/miembros`, {})
            }
            // Refrescar comunidad para actualizar miembros
            await loadComunidad()
        } catch (e: any) {
            joinError = e?.message ?? 'No se pudo unir a la comunidad'
        } finally {
            joining = false
        }
    }

    async function loadPropuestasRelacionadas() {
        if (!comunidadId) return
        loadingPropuestas = true
        propuestasError = null
        try {
            // Preferir endpoint directo bajo comunidad
            let list: any[] = []
            try {
                const {data: d1}: any = await api.get(`/comunidades/${comunidadId}/propuestas`)
                list = (d1?.data ?? d1 ?? []) as any[]
            } catch {
                const {data: d2}: any = await api.get(`/propuestas?comunidadId=${encodeURIComponent(comunidadId)}&limit=100`)
                list = (d2?.data ?? d2 ?? []) as any[]
            }
            propuestas = list
        } catch (e: any) {
            propuestasError = e?.message ?? 'Error cargando propuestas relacionadas'
        } finally {
            loadingPropuestas = false
        }
    }

    async function loadComunidad() {
        if (!comunidadId) return
        loading = true
        error = null
        try {
            const {data} = await api.get(`/comunidades/${comunidadId}`)
            // Desempaqueta payloads tipo { data: comunidad } o usa plano
            comunidad = (data as any)?.data ?? data
            features = comunidadToFeatures(comunidad)
            miembros = (comunidad?.miembros ?? []) as any[]
            // Cargar propuestas relacionadas en paralelo (no bloquear)
            puedeUnirse = comunidad.puedeUnirse ?? false
            esMiembro = comunidad.esMiembro ?? false
            esCreador = comunidad.esCreador ?? false
            await loadPropuestasRelacionadas()
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
        <header class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 id="comunidad-heading" class="min-w-50 text-2xl font-semibold tracking-tight">
                {comunidad.nombre ?? `Comunidad ${comunidadId}`}
            </h1>
            <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Volver</a>
        </header>

        <!-- Meta: creador y acción de unirse -->
        <div class="mb-4 flex flex-wrap items-center gap-3 text-sm text-base-content/70">
            {#if comunidad.creador || comunidad.usuario || comunidad.owner || comunidad.cuenta}
                {@const creador = comunidad.creador ?? comunidad.usuario ?? comunidad.owner ?? comunidad.cuenta}
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Creador: <span
                            class="font-medium text-base-content">{creador.nombre ?? creador.identificador ?? creador.username ?? creador.email ?? 'Usuario'}</span></span>
                </div>
            {/if}


            <nav class="flex items-center gap-2">
                {#if puedeUnirse}
                    <button class="btn btn-sm btn-primary text-white" onclick={(e) => requireAuthClick(e) && joinCommunity()} disabled={joining}
                            aria-label="Unirme a esta comunidad">
                        {joining ? 'Uniendo…' : 'Unirme a esta comunidad'}
                    </button>
                {:else if esMiembro || esCreador}
                    <span class="badge badge-success badge-outline">{`${esMiembro ? "Miembro" : "Creador"}`}</span>
                {/if}
                <a class="btn btn-primary btn-sm text-white" href={`/comunidades/${comunidadId}/recomendar`}
                   onclick={goto}>Ver comunidades cercanas</a>
            </nav>
        </div>
        {#if joinError}
            <div role="alert" class="alert alert-error mb-4" aria-live="polite"><span>{joinError}</span></div>
        {/if}

        <article class="prose max-w-none space-y-3">
            {#if comunidad.descripcion}
                <p>{comunidad.descripcion}</p>
            {:else}
                <p class="text-base-content/70">Sin descripción.</p>
            {/if}

            <div class="not-prose mt-4 grid grid-cols-1 gap-3">
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body py-4">
                        <div class="text-sm text-base-content/70">Categoría</div>
                        <div class="mt-1 flex items-center gap-2">
                            {#if comunidad.categoria || comunidad.tipo || (comunidad.categorias && comunidad.categorias.length)}
                                <span class="inline-block h-3 w-3 rounded-full bg-primary"></span>
                                <span class="font-medium">
                  {typeof (comunidad.categoria ?? comunidad.tipo ?? comunidad.categorias?.[0]) === 'string'
                      ? (comunidad.categoria ?? comunidad.tipo ?? comunidad.categorias?.[0])
                      : (comunidad.categoria?.nombre ?? comunidad.tipo?.nombre ?? comunidad.categorias?.[0]?.nombre)}
                </span>
                            {:else}
                                <span class="text-base-content/60">Sin categoría</span>
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-sm">
                    <div class="card-body py-4">
                        <div class="text-sm text-base-content/70">Zona (polígono)</div>
                        {#if Array.isArray(features) && features.length}
                            <div class="mt-1 text-sm">
                                {getPolygonPointCount(features)} puntos
                            </div>
                            <div class="mt-2">
                                <div class="w-full h-full rounded-lg border border-base-300 overflow-hidden">
                                    <Map colonias={features} onColoniaClick={() => {}}/>
                                </div>
                            </div>
                        {:else}
                            <div class="mt-1 text-sm text-base-content/60">Sin definir</div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Miembros de la comunidad (colapsable) -->
            <div class="not-prose mt-6">
                <details open>
                    <summary class="text-xl font-semibold mb-3 cursor-pointer select-none">
                        Miembros de la comunidad
                        {#if miembros && miembros.length}({miembros.length}){/if}
                    </summary>
                    {#if !miembros || miembros.length === 0}
                        <div class="text-sm text-base-content/60">Sin miembros aún.</div>
                    {:else}
                        <div class="space-y-2">
                            {#each (showAllMembers ? miembros : miembros.slice(0, 10)) as m}
                                <div class="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-300">
                                    <div class="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                                        {miembroInicial(m)}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium break-all">{miembroNombre(m)}</p>
                                        {#if miembroCorreo(m)}
                                            <p class="text-sm text-base-content/70 break-all">{miembroCorreo(m)}</p>
                                        {/if}
                                        {#if m?.createdAt}
                                            <p class="text-xs text-base-content/60">Desde {toYMD(m.createdAt)}</p>
                                        {/if}
                                    </div>
                                    {#if m?.isActive}
                                        <span class="badge badge-success badge-sm">Activo</span>
                                    {:else}
                                        <span class="badge badge-ghost badge-sm">Invitado</span>
                                    {/if}
                                </div>
                            {/each}
                            {#if miembros.length > 10 && !showAllMembers}
                                <button class="btn btn-outline btn-sm" onclick={() => showAllMembers = true}>
                                    Ver más ({miembros.length - 10} más)
                                </button>
                            {:else if showAllMembers && miembros.length > 10}
                                <button class="btn btn-outline btn-sm" onclick={() => showAllMembers = false}>
                                    Ver menos
                                </button>
                            {/if}
                        </div>
                    {/if}
                </details>
            </div>

            <!-- Propuestas relacionadas (colapsable) -->
            <div class="not-prose mt-6">
                <details open>
                    <summary class="text-xl font-semibold mb-3 cursor-pointer select-none">
                        Propuestas relacionadas
                        {#if propuestas && propuestas.length}({propuestas.length}){/if}
                    </summary>
                    {#if loadingPropuestas}
                        <div class="text-sm text-base-content/60">Cargando propuestas…</div>
                    {:else if propuestasError}
                        <div role="alert" class="alert alert-error"><span>{propuestasError}</span></div>
                    {:else if !propuestas || propuestas.length === 0}
                        <div class="text-sm text-base-content/60">No hay propuestas en esta comunidad todavía.</div>
                    {:else}
                        <ul class="space-y-3">
                            {#each propuestas as p}
                                {@const pid = p?.id ?? p?._id}
                                <li class="card bg-base-100 border border-base-300">
                                    <div class="card-body py-3">
                                        <div class="flex items-start justify-between gap-3">
                                            <div>
                                                <a href={`/propuestas/${pid}`} onclick={goto}
                                                   class="link link-primary font-medium break-all">{p?.titulo ?? p?.title ?? `Propuesta ${pid}`}</a>
                                                {#if p?.actividades}
                                                    {@const
                                                        acts = Array.isArray(p.actividades) ? p.actividades : Object.values(p.actividades ?? {})}
                                                    {#if acts && acts.length}
                                                        <ul class="mt-2 space-y-1 text-sm text-base-content/80">
                                                            {#each acts as a}
                                                                <li class="flex items-center gap-2">
                                                                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                                    <span class="break-all">{a?.nombre ?? a?.title ?? 'Actividad'}
                                                                        {#if a?.fecha} — {new Date(a.fecha).toLocaleDateString('es-MX')}{/if}
                                                                        {#if a?.horario} {a.horario}{/if}</span>
                                                                </li>
                                                            {/each}
                                                        </ul>
                                                    {/if}
                                                {/if}
                                            </div>
                                            <a href={`/propuestas/${pid}`} onclick={goto} class="btn btn-sm">Ver</a>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </details>
            </div>
        </article>
    {/if}
</section>

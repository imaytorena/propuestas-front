<script lang="ts">
    import {onMount} from 'svelte'
    import {route} from '../../router'
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'
    import Map from '../../lib/components/Map.svelte'
    import {toPolygonFeatureFromAny} from '../../utils/geo'

    // Ruta y estado base
    let comunidadId: string = ''

    let loading = $state(true)
    let error: string | null = $state(null)
    let comunidad: any = $state(null)
    let baseFeature: any = $state(null)

    // Recomendaciones
    let recomLoading = $state(false)
    let recomError: string | null = $state(null)
    let resultados: any[] = $state([])
    let resultFeatures: any[] = $state([])

    // Slider para cantidad de recomendaciones (5..15)
    let k = $state(10)
    const K_MIN = 5
    const K_MAX = 15

    // Control para evitar condiciones de carrera al recargar recomendaciones
    let loadSeq = $state(0)

    function toKm(n: any): string {
        const x = Number(n)
        if (!Number.isFinite(x)) return '—'
        return `${x.toFixed(1)} km`
    }

    function navigateToComunidad(id: any) {
        if (!id) return
        window.location.href = `/comunidades/${encodeURIComponent(id)}`
    }

    async function loadComunidad() {
        if (!comunidadId) return
        loading = true
        error = null
        try {
            const {data} = await api.get(`/comunidades/${comunidadId}`)
            comunidad = (data as any)?.data ?? data
            // Construir un Feature de la comunidad base (polígono) para el mapa
            baseFeature = toPolygonFeatureFromAny(comunidad, {
                id: comunidad?.id ?? comunidadId,
                nombre: comunidad?.nombre ?? `Comunidad ${comunidadId}`,
                municipio: comunidad?.municipio?.nombre ?? comunidad?.municipio ?? '',
                color: '#111827' // gris oscuro para distinguir la base
            })
        } catch (e: any) {
            error = e?.message ?? 'Error cargando comunidad'
        } finally {
            loading = false
        }
    }

    async function loadRecomendaciones(seq?: number) {
        const thisSeq = seq ?? ++loadSeq
        if (!comunidadId) return
        if (!baseFeature?.geometry) {
            recomError = 'No se encontró geometría de la comunidad para recomendar'
            return
        }
        recomLoading = true
        recomError = null
        try {
            const payload: any = {
                geometry: baseFeature.geometry,
                k: Math.max(K_MIN, Math.min(K_MAX, Number(k) || 10)),
            }
            const {data} = await api.post(`/comunidades/recomendar`, payload)
            if (thisSeq !== loadSeq) return // abort if outdated
            const list: any[] = (data?.data ?? data ?? []) as any[]
            resultados = list
            // Mapear cada geometry a Feature para el mapa
            const feats = list
                .map((it: any) => {
                    const f = toPolygonFeatureFromAny(it?.geometry ?? it, {
                        id: it?.id ?? it?._id,
                        nombre: it?.nombre ?? 'Comunidad',
                        distKm: it?.distKm,
                        coloniaId: it?.coloniaId ?? null,
                        color: '#0ea5e9' // azul (distinguible de la base)
                    })
                    return f
                })
                .filter(Boolean)
            resultFeatures = feats
        } catch (e: any) {
            recomError = e?.message ?? 'Error cargando recomendaciones'
        } finally {
            if (thisSeq === loadSeq) {
                recomLoading = false
            }
        }
    }

    function refreshRecs() {
        // Incrementa secuencia y recarga
        loadSeq = (loadSeq || 0) + 1
        loadRecomendaciones(loadSeq)
    }

    // Cuando cambia el id de ruta, recargar comunidad y recomendaciones
    $effect(() => {
        const id = $route.params.comunidadId
        if (id !== comunidadId) {
            comunidadId = id
            loadComunidad().then(() => {
                // Una vez que haya baseFeature, cargar recomendaciones
                refreshRecs()
            })
        }
    })

    onMount(async () => {
        await loadComunidad()
        await loadRecomendaciones(++loadSeq)
    })

    // Datos combinados para el mapa: primero la base (si existe), luego recomendadas
    let allFeatures = $derived(() => {
        const base = baseFeature ? [baseFeature] : []
        return [...base, ...(Array.isArray(resultFeatures) ? resultFeatures : [])]
    })
</script>

<section class="mx-auto max-w-5xl px-4 py-4 sm:py-6">
    <header class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">
                Comunidades cercanas
                {#if comunidad?.nombre}a “{comunidad.nombre}”{/if}
            </h1>
            <p class="text-sm text-base-content/70">Recomendaciones basadas en la zona de la comunidad.</p>
        </div>
        <a class="btn btn-ghost btn-sm" href={`/comunidades/${comunidadId}`} onclick={goto}>Volver al detalle</a>
    </header>

    {#if loading}
        <article class="card bg-base-100 shadow-sm mb-6">
            <div class="card-body animate-pulse">
                <div class="h-6 w-2/3 rounded bg-base-200"></div>
                <div class="mt-3 h-4 w-full rounded bg-base-200"></div>
                <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
            </div>
        </article>
    {:else if error}
        <div role="alert" class="alert alert-error mb-6">
            <span>{error}</span>
            <div class="ml-auto">
                <button class="btn btn-sm" onclick={loadComunidad}>Reintentar</button>
            </div>
        </div>
    {/if}

    <!-- Controles -->
    <div class="card bg-base-100 shadow-sm mb-4">
        <div class="card-body py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label class="label"><span class="label-text">Número de recomendaciones</span></label>
                    <input type="range" min={K_MIN} max={K_MAX} step="1" bind:value={k} class="range range-primary"/>
                    <div class="mt-1 text-sm text-base-content/80">Mostrando: <span class="font-medium">{k}</span>
                        recomendaciones
                    </div>
                </div>
                <div class="md:col-span-2 flex items-end gap-2">
                    <button class="btn btn-primary text-white" onclick={refreshRecs} disabled={recomLoading || loading}>
                        {recomLoading ? 'Actualizando…' : 'Actualizar recomendaciones'}
                    </button>
                    {#if recomError}
                        <span class="text-error text-sm">{recomError}</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Mapa -->
    <div class="mb-6">
        <div class="w-full h-full rounded-lg border border-base-300 overflow-hidden">
            <Map colonias={allFeatures} onColoniaClick={(props) => navigateToComunidad(props?.id)}/>
        </div>
    </div>

    <!-- Lista de resultados -->
    <section class="mt-4">
        <h2 class="text-xl font-semibold mb-3">Resultados</h2>
        {#if recomLoading && (!resultados || resultados.length === 0)}
            <div class="text-sm text-base-content/60">Buscando recomendaciones…</div>
        {:else if !resultados || resultados.length === 0}
            <div class="text-sm text-base-content/60">No hay recomendaciones con los parámetros actuales.</div>
        {:else}
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each resultados as r}
                    <li class="card bg-base-100 border border-base-300">
                        <div class="card-body py-3">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <a href={`/comunidades/${r.id}`} onclick={goto}
                                       class="link link-primary font-medium break-all">{r.nombre ?? `Comunidad ${r.id}`}</a>
                                    <div class="text-sm text-base-content/70 mt-1">Distancia: {toKm(r.distKm)}</div>
                                    {#if r.coloniaId}
                                        <div class="text-xs text-base-content/60">Colonia ID: {r.coloniaId}</div>
                                    {/if}
                                </div>
                                <a href={`/comunidades/${r.id}`} onclick={goto} class="btn btn-sm">Ver</a>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>
</section>

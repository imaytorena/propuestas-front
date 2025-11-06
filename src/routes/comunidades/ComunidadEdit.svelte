<script lang="ts">
    import Map from '../../lib/components/Map.svelte'
    import {onDestroy, onMount} from 'svelte'
    import page from 'page'
    import {route} from '../../router'
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'
    import toast from '../../lib/toast'
    import { latLngArrayToLegacyCoords } from '../../utils/geo'

    let comunidadId = $derived($route.params.comunidadId);

    // Form state
    let nombre = $state<string>('')
    let descripcion = $state<string>('')
    let loading = $state(true)
    let saving = $state(false)
    let error = $state<string | null>(null)
    let saveError = $state<string | null>(null)
    let loaded = $state(false)

    // Categorías de comunidad (antes "tipo")
    const categoriasOpciones: string[] = [
        'Vecinos',
        'Estudiantes',
        'Madres y padres de familia',
        'Personas mayores',
        'Pueblos originarios',
        'Trabajadores',
        'Colectivos',
        'Ciclistas',
        'Personas con discapacidad',
        'Agricultores',
        'Voluntariado',
        'Sociedad',
    ]
    let selectedCategoria = $state<string>('')
    const categoriaColor: Record<string, string> = {
        'Vecinos': '#2563eb',
        'Estudiantes': '#16a34a',
        'Madres y padres de familia': '#f59e0b',
        'Personas mayores': '#ef4444',
        'Pueblos originarios': '#a855f7',
        'Trabajadores': '#0ea5e9',
        'Colectivos': '#22c55e',
        'Ciclistas': '#eab308',
        'Personas con discapacidad': '#fb7185',
        'Agricultores': '#10b981',
        'Voluntariado': '#f97316',
        'Sociedad': '#64748b'
    }
    let selectedColor = $state<string>('var(--color-primary)')
    let lastSelectedCategoria: string | null = null
    $effect(() => {
        selectedColor = categoriaColor[selectedCategoria] ?? 'var(--color-primary)'
        if (selectedCategoria && selectedCategoria !== lastSelectedCategoria) {
            clearPoints()
        }
        lastSelectedCategoria = selectedCategoria
    })

    // Mapa y polígono temporal (igual que en creación)
    type LatLng = { lat: number; lng: number }
    let mapContainer: HTMLElement
    let map: any
    let polygonLayer: any
    let markerLayer: any
    let polygonPoints = $state<LatLng[]>([])

    // GeoJSON features for Map.svelte
    let features: any[] = $state([])

    function pointsToFeatures(pts: LatLng[]): any[] {
        if (!Array.isArray(pts) || pts.length < 3) return []
        const ring: [number, number][] = pts.map(p => [p.lng, p.lat])
        const first = ring[0]
        const last = ring[ring.length - 1]
        if (first[0] !== last[0] || first[1] !== last[1]) {
            ring.push([first[0], first[1]])
        }
        return [{
            type: 'Feature',
            geometry: {type: 'Polygon', coordinates: [ring]},
            properties: {
                id: comunidadId,
                nombre: nombre || 'Comunidad',
                municipio: ''
            }
        }]
    }

    // Recompute features when points change or name changes
    // $effect(() => {
    //     // console.log('features:', $state.snapshot(features))
    // })
    let LOCAL_KEY = $derived(`comunidad:${comunidadId}:polygon`)

    function validate(): string | null {
        if (!nombre.trim()) return 'El nombre es obligatorio'
        return null
    }

    function persistPolygon() {
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(polygonPoints))
        } catch (_) {
        }
    }

    function addPoint(latlng: LatLng) {
        polygonPoints = [...polygonPoints, latlng]
        drawOverlays()
        persistPolygon()
    }

    function undoPoint() {
        if (!polygonPoints.length) return
        polygonPoints = polygonPoints.slice(0, -1)
        drawOverlays()
        persistPolygon()
    }

    function clearPoints() {
        polygonPoints = []
        drawOverlays()
        persistPolygon()
    }

    function drawOverlays() {
        if (!map) return
        if (markerLayer) markerLayer.clearLayers()
        if (polygonLayer) polygonLayer.remove()

        // markers
        markerLayer = markerLayer || L.layerGroup().addTo(map)
        polygonPoints.forEach((p, idx) => {
            L.circleMarker([p.lat, p.lng], {
                radius: 6,
                color: selectedColor,
                fillColor: selectedColor,
                fillOpacity: 1,
                weight: 2
            }).addTo(markerLayer)

            if (idx > 0) {
                L.polyline([
                    [polygonPoints[idx - 1].lat, polygonPoints[idx - 1].lng],
                    [p.lat, p.lng]
                ], {
                    color: selectedColor,
                    weight: 2
                }).addTo(map)
            }
        })

        if (polygonPoints.length >= 3) {
            polygonLayer = L.polygon(polygonPoints.map(p => [p.lat, p.lng] as any), {
                color: selectedColor,
                fillColor: selectedColor,
                fillOpacity: 0.2,
                weight: 2
            }).addTo(map)
        }
    }

    async function loadComunidad() {
        if (!comunidadId) return
        loading = true
        error = null
        try {
            const {data: comunidad} = await api.get(`/comunidades/${comunidadId}`)
            nombre = comunidad?.nombre ?? ''
            descripcion = comunidad?.descripcion ?? ''
            // Pre-cargar categoría desde string u objeto { nombre }
            const cat = comunidad?.categoria ?? comunidad?.tipo ?? comunidad?.categorias?.[0]
            selectedCategoria = typeof cat === 'string' ? cat : (cat?.nombre ?? '')
            // Restaurar polígono temporal si existe; si no, intentar desde API
            let restored = false
            const apiPoly = comunidad?.poligono ?? comunidad?.polygon ?? comunidad?.area
            if (Array.isArray(apiPoly)) {
                const norm: any[] = []
                for (const p of apiPoly) {
                    if (p && typeof p.lat === 'number' && typeof p.lng === 'number') {
                        norm.push({lat: p.lat, lng: p.lng})
                    } else if (Array.isArray(p) && p.length >= 2) {
                        const a = p.map(Number)
                        // Detect [lat, lng] or [lng, lat] by range
                        const [a0, a1] = a
                        const looksLatLng = a0 >= -90 && a0 <= 90 && a1 >= -180 && a1 <= 180
                        if (looksLatLng) norm.push({lat: a0, lng: a1})
                        else norm.push({lat: a1, lng: a0})
                    }
                }
                polygonPoints = norm
            }
            loaded = true
        } catch (e: any) {
            error = e?.message ?? 'Error cargando comunidad'
            toast.push(error)
        } finally {
            loading = false
            // Redibujar overlays si el mapa ya existe
            drawOverlays()
            // Si ya hay mapa y puntos, ajustar vista
            if (map && Array.isArray(polygonPoints) && polygonPoints.length) {
                try {
                    const latlngs = polygonPoints.map(p => [p.lat, p.lng]) as any
                    map.fitBounds(latlngs, {padding: [20, 20]})
                } catch (_) {
                }
            }
        }
    }

    async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault()
        if (!comunidadId) return
        saveError = null
        const err = validate()
        if (err) {
            toast.error(err)
            return
        }
        // Log temporal data
        console.log('Edit comunidad polygon (temporal):', polygonPoints)
        console.log('Categoría seleccionada:', selectedCategoria)

        saving = true
        try {
            const payload: any = {nombre, descripcion}
            if (selectedCategoria) payload.categoria = selectedCategoria
            // Enviar el polígono si hay suficientes puntos (formato legacy [[[lng,lat],...]] )
            if (Array.isArray(polygonPoints) && polygonPoints.length >= 3) {
                payload.poligono = latLngArrayToLegacyCoords(polygonPoints)
            }
            await api.put(`/comunidades/${comunidadId}`, payload)
            toast.success('Comunidad actualizada')
            page.show(`/comunidades/${comunidadId}`)
        } catch (e: any) {
            saveError = e?.message ?? 'No se pudo guardar'
            toast.error(saveError)
        } finally {
            saving = false
        }
    }

    function initMap() {
        // Inicializar mapa cuando el contenedor exista en el DOM y tenga tamaño
        if (!mapContainer) return
        const ensureInit = () => {
            if (!mapContainer) return
            const hasSize = (mapContainer.offsetWidth ?? 0) > 0 && (mapContainer.offsetHeight ?? 0) > 0
            if (!hasSize) {
                // Reintentar en el siguiente frame si aún no tiene tamaño
                requestAnimationFrame(ensureInit)
                return
            }
            if (map) return
            map = L.map(mapContainer).setView([20.6597, -103.3496], 12)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: 'OpenStreetMap, CartoDB',
                maxZoom: 19,
                minZoom: 2
            }).addTo(map)

            const bounds = [
                [14.5, -118.5],
                [32.8, -86.5]
            ]
            map.setMaxBounds(bounds as any)
            map.on('drag', () => map.panInsideBounds(bounds as any, {animate: false}))

            map.on('click', (e: any) => {
                const {lat, lng} = e.latlng || {}
                if (typeof lat === 'number' && typeof lng === 'number') {
                    addPoint({lat, lng})
                }
            })

            // Dibujo inicial y ajuste de vista si había puntos
            drawOverlays()
            if (Array.isArray(polygonPoints) && polygonPoints.length) {
                try {
                    const latlngs = polygonPoints.map(p => [p.lat, p.lng]) as any
                    map.fitBounds(latlngs, {padding: [20, 20]})
                } catch (_) {
                }
            }
        }
        requestAnimationFrame(ensureInit)
    }

    // Inicializa el mapa en cuanto el contenedor esté disponible
    $effect(() => {
        features = pointsToFeatures(polygonPoints)
    });

    $effect(() => {
        if (!map && mapContainer) {
            initMap()
            // Dibujo inicial si ya hay puntos cargados
            drawOverlays()
        }
    })

    onMount(() => {
        // Solo cargar la comunidad; el mapa se creará cuando el contenedor exista
        loadComunidad()

        return () => {
            if (map) {
                map.remove()
            }
            markerLayer = null
            polygonLayer = null
        }
    })

    onDestroy(() => {
        clearPoints()
    })
</script>

<section aria-labelledby="edit-comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
    {#if loading}
        <article class="card bg-base-100 shadow-sm">
            <div class="card-body animate-pulse">
                <div class="h-6 w-2/3 rounded bg-base-200"></div>
                <div class="mt-3 h-4 w-full rounded bg-base-200"></div>
                <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
            </div>
        </article>
    {:else if error}
        <div role="alert" class="alert alert-error">
            <span>{error}</span>
            <div class="ml-auto">
                <button class="btn btn-sm" onclick={loadComunidad}>Reintentar</button>
            </div>
        </div>
    {:else if !loaded}
        <div class="rounded-box border border-base-300 p-8 text-center">
            <p class="mb-2 text-lg">Comunidad no encontrada.</p>
            <a class="btn" href="/comunidades" onclick={goto}>Volver a la lista</a>
        </div>
    {:else}
        <header class="mb-4 flex items-center justify-between gap-3">
            <h1 id="edit-comunidad-heading" class="text-2xl font-semibold tracking-tight">Editar
                comunidad {comunidadId}</h1>
            <a class="btn btn-ghost btn-sm" href={`/comunidades/${comunidadId}`} onclick={goto}>Cancelar</a>
        </header>

        <form class="space-y-4" onsubmit={save}>
            <div class="form-control">
                <label class="label" for="nombre">
                    <span class="label-text">Nombre</span>
                </label>
                <input
                        id="nombre"
                        class="input input-bordered w-full"
                        type="text"
                        bind:value={nombre}
                        placeholder="Nombre de la comunidad"
                        required
                        disabled={saving}
                />
            </div>

            <div class="form-control">
                <label class="label" for="descripcion">
                    <span class="label-text">Descripción</span>
                </label>
                <textarea
                        id="descripcion"
                        class="textarea textarea-bordered w-full"
                        rows="6"
                        bind:value={descripcion}
                        placeholder="Describe la comunidad"
                        disabled={saving}
                ></textarea>
            </div>

            <div class="form-control">
                <label class="label flex flex-col items-start">
                    <span class="label-text">Zona de la comunidad</span>
                </label>
                {#if features.length}
                    <div class="mt-1 text-sm">{polygonPoints.length} {polygonPoints.length === 1 ? 'punto' : 'puntos'}</div>
                    <div class="mt-2">
                        <div class="w-full h-full rounded-lg border border-base-300 overflow-hidden">
                            <Map colonias={features} onColoniaClick={() => {}}/>
                        </div>
                    </div>
                {/if}
            </div>

            <div class="form-control">
                <label class="label" for="categoria">
          <span class="text-sm italic flex items-center gap-2">
            <span class="inline-block h-4 w-4 rounded" style={`background:${selectedColor}`}></span>
          </span>
                    <span class="label-text">Categoría</span>
                </label>
                <select id="categoria" class={`select select-bordered w-full`} style={`border-color:${selectedColor}`}
                        bind:value={selectedCategoria} disabled={saving}>
                    <option value="" disabled>Selecciona categoría</option>
                    {#each categoriasOpciones as op}
                        <option value={op}>{op}</option>
                    {/each}
                </select>
            </div>

            {#if saveError}
                <div role="alert" class="alert alert-error" aria-live="polite">
                    <span>{saveError}</span>
                </div>
            {/if}

            <div class="flex items-center justify-end gap-2">
                <a class="btn btn-ghost" href={`/comunidades/${comunidadId}`} onclick={goto} type="button">Cancelar</a>
                <button class="btn btn-primary text-white" type="submit" disabled={saving}>
                    {saving ? 'Guardando…' : 'Guardar'}
                </button>
            </div>
        </form>

        <p class="mt-4"><a href="/comunidades" onclick={goto} class="link">Volver a la lista</a></p>
    {/if}
</section>


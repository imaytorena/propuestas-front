<script lang="ts">
    import page from 'page'
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'
    import toast from '../../lib/toast'
    import {onDestroy, onMount} from 'svelte'

    // Form state
    let nombre = $state<string>('')
    let descripcion = $state<string>('')
    let saving = $state(false)
    let saveError = $state<string | null>(null)

    // Tipos de comunidad (selección múltiple, sugerencias)
    const tiposOpciones: string[] = [
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
    // Selección simple de tipo y color asociado
    let selectedTipo = $state<string>('')
    const tipoColor: Record<string, string> = {
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
    let lastSelectedTipo: string | null = null
    $effect(() => {
        // Actualiza el color según el tipo seleccionado
        selectedColor = tipoColor[selectedTipo] ?? 'var(--color-primary)'
        // Limpia la entrada (puntos del polígono) cuando cambia la selección
        if (selectedTipo && selectedTipo !== lastSelectedTipo) {
            clearPoints()
        }
        lastSelectedTipo = selectedTipo
    })

    // Map state (temporal polygon data)
    type LatLng = { lat: number; lng: number }
    let mapContainer: HTMLElement
    let map: any
    let polygonLayer: any
    let markerLayer: any
    let polygonPoints = $state<LatLng[]>([])
    const LOCAL_KEY = 'comunidad:new:polygon'

    function validate(): string | null {
        if (!nombre.trim()) return 'El nombre es obligatorio'
        return null
    }

    function persistPolygon() {
        try {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(polygonPoints))
        } catch (_) {
            // ignore storage errors
        }
        console.log('Polygon points (temporal):', polygonPoints)
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
                weight: 2,
                title: `Punto ${idx + 1}`
            }).addTo(markerLayer)
        })

        // polygon
        if (polygonPoints.length >= 3) {
            polygonLayer = L.polygon(polygonPoints.map((p) => [p.lat, p.lng]), {
                color: selectedColor,
                fillOpacity: 0.2,
                weight: 2
            }).addTo(map)
        }
    }

    onMount(() => {
        // Restore temporal polygon if present
        try {
            clearPoints();
            const stored = localStorage.getItem(LOCAL_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    polygonPoints = parsed.filter((p) => typeof p?.lat === 'number' && typeof p?.lng === 'number')
                }
            }
        } catch (_) {
        }

        map = L.map(mapContainer).setView([20.6597, -103.3496], 12)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: 'OpenStreetMap, CartoDB',
            maxZoom: 19,
            minZoom: 2
        }).addTo(map)

        // Optional: restrict bounds slightly to Mexico West area
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

        // Initial draw
        drawOverlays()

        return () => {
            map && map.remove()
            markerLayer = null
            polygonLayer = null
        }
    })

    onDestroy(() => {
        clearPoints()
    });

    async function create(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault()
        saveError = null
        const err = validate()
        if (err) {
            toast.error(err)
            return
        }

        // Log polygon data before sending request
        console.log('Submitting comunidad with polygon (temporal, not sent to API):', polygonPoints)
        console.log('Tipo de comunidad seleccionado (temporal, no enviado al API):', selectedTipo)

        saving = true
        try {
            // Construye el payload para el API
            const payload: any = { nombre, descripcion }
            if (selectedTipo) payload.categoria = selectedTipo
            // Enviar el polígono si hay suficientes puntos
            if (Array.isArray(polygonPoints) && polygonPoints.length >= 3) {
                payload.poligono = polygonPoints
            }
            const {data} = await api.post(`/comunidades`, payload)
            const created = data?.data ?? data
            const id = created?.id
            toast.success('Comunidad creada')
            if (id) {
                page.show(`/comunidades/${id}`)
            } else {
                page.show('/comunidades')
            }
        } catch (e: any) {
            saveError = e?.message ?? 'No se pudo crear la comunidad'
            toast.error(saveError)
        } finally {
            saving = false
        }
    }
</script>

<section aria-labelledby="create-comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
    <header class="mb-4 flex items-center justify-between gap-3">
        <h1 id="create-comunidad-heading" class="text-2xl font-semibold tracking-tight">Crear comunidad</h1>
        <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Cancelar</a>
    </header>

    <form class="space-y-4" onsubmit={create}>
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
            <label class="label" for="tipos">
                <span class="text-sm italic flex items-center gap-2">
                    <span class="inline-block h-4 w-4 rounded" style={`background:${selectedColor}`}></span>
                </span>
                <span class="label-text">Tipo de comunidad</span>
            </label>
            <select id="tipos" class={`select select-bordered w-full`} style={`border-color:${selectedColor}`}
                    bind:value={selectedTipo} disabled={saving}>
                <option value="" disabled>Selecciona tipo de comunidad</option>
                {#each tiposOpciones as op}
                    <option value={op}>{op}</option>
                {/each}
            </select>
        </div>

        <div class="form-control">
            <label class="label flex flex-col items-start">
                <span class="label-text">
                    Zona de la comunidad (temporal)
                </span>
                <span class="text-sm italic">Haz click en el mapa para agregar puntos</span>
            </label>
            <div bind:this={mapContainer} class="w-full h-[45vh] rounded-lg border-2" id="create-map"></div>
            <div class="mt-2 flex items-center gap-2 text-sm">
                <span>{polygonPoints.length} {polygonPoints.length === 1 ? 'punto' : 'puntos'}</span>
                <button class="btn btn-xs" type="button" onclick={undoPoint} disabled={!polygonPoints.length}>Deshacer
                </button>
                <button class="btn btn-xs btn-ghost" type="button" onclick={clearPoints}
                        disabled={!polygonPoints.length}>Limpiar
                </button>
            </div>
        </div>

        {#if saveError}
            <div role="alert" class="alert alert-error" aria-live="polite">
                <span>{saveError}</span>
            </div>
        {/if}

        <div class="flex items-center justify-end gap-2">
            <a class="btn btn-ghost" href="/comunidades" onclick={goto} type="button">Cancelar</a>
            <button class="btn btn-primary text-white" type="submit" disabled={saving}>
                {saving ? 'Creando…' : 'Crear'}
            </button>
        </div>
    </form>
</section>

<style>
    #create-map :global(.leaflet-container) {
        border-radius: 0.5rem;
    }
</style>

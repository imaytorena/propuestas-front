<script lang="ts">
    import SvelteSelect from 'svelte-select';
    import './select.css'
    import api from "../../../utils/api";
    import {onMount} from 'svelte';
    import {toast} from "svelte-french-toast";

    type ComunidadValue = { nombre: string; municipio?: string; lat?: number; lon?: number; lng?: number };
    type ComunidadOption = { id: number; label: string; value: ComunidadValue };

    let {ideas} = $props();
    let newIdeaText: string = $state('');
    let selectedComunidad: ComunidadOption | null = $state(null);
    let comunidades: ComunidadOption[] = $state([]);
    let loadingComunidades: boolean = $state(false);

    function toNumber(n: any): number | undefined {
        const x = Number(n);
        return Number.isFinite(x) ? x : undefined;
    }

    function getLatLon(item: any): { lat?: number; lon?: number } {
        const lat = toNumber(item?.lat ?? item?.latitude ?? item?.y ?? item?.latitud ?? item?.geom?.coordinates?.[1]);
        const lon = toNumber(item?.lon ?? item?.lng ?? item?.long ?? item?.longitude ?? item?.x ?? item?.longitud ?? item?.geom?.coordinates?.[0]);
        return {lat, lon};
    }

    function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
        const R = 6371e3; // meters
        const toRad = (d: number) => d * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
        return R * c; // meters
    }

    async function loadComunidades(userPos?: { lat: number; lon: number }) {
        loadingComunidades = true;
        try {
            const {data: res}: any = await api.get(`/comunidades?limit=1200`);
            const list: any[] = res?.data ?? res?.comunidades ?? res ?? [];
            let mapped: ComunidadOption[] = list.map((it: any) => {
                const {lat, lon} = getLatLon(it);
                const nombre = it?.nombre ?? it?.name ?? it?.comunidad ?? 'Comunidad';
                const municipio = it?.municipio ?? it?.city ?? it?.municipality;
                const label = `${nombre}${municipio ? ` (${municipio})` : ''}`;
                return {id: it.id, label, value: {nombre, municipio, lat, lon}} as ComunidadOption;
            });

            // If we have user position and items with coordinates, sort by distance and mark top 5
            if (userPos) {
                const withCoords = mapped.filter(o => typeof o.value.lat === 'number' && typeof o.value.lon === 'number');
                withCoords.sort((a, b) => haversine(userPos, {
                    lat: a.value.lat!,
                    lon: a.value.lon!
                }) - haversine(userPos, {lat: b.value.lat!, lon: b.value.lon!}));
                const top = new Set(withCoords.slice(0, 5).map(o => o.label));
                mapped = mapped.map(o => top.has(o.label) ? ({...o, label: `⭐ ${o.label}`}) : o);
                // Also move recommended to the top
                mapped.sort((a, b) => Number(b.label.startsWith('⭐')) - Number(a.label.startsWith('⭐')));
            }

            comunidades = mapped;
        } catch (e) {
            console.error('Error cargando comunidades', e);
        } finally {
            loadingComunidades = false;
        }
    }

    onMount(() => {
        // Try to get user position for recommendations
        if (navigator?.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = {lat: pos.coords.latitude, lon: pos.coords.longitude};
                    loadComunidades(coords);
                },
                () => loadComunidades(),
                {enableHighAccuracy: true, timeout: 7000}
            );
        } else {
            loadComunidades();
        }
    });
    const onSave = async () => {
        // if (selectedComunidad) {
        //     payload.comunidadNombre = selectedComunidad.value.nombre;
        //     payload.comunidadMunicipio = selectedComunidad.value.municipio;
        // }
        const {data} = await api.post(`/ideas`, {contenido: newIdeaText, comunidadId: selectedComunidad?.id});
        const {idea} = data;
        newIdeaText = '';
        selectedComunidad = null;
        ideas.unshift(idea);
    }
    const onclick = async () => {

        await toast.promise(
            onSave(),
            {
                loading: 'Cargando…',
                success: 'Listo',
                error: 'Error cargando ideas'
            }
        )
    };


    $effect(() => {
        console.log('selectedComunidad', selectedComunidad);
    })
</script>
<div class="card bg-base-100 shadow-xl w-full mx-auto mb-12">
    <div class="card-body">
        <h2 class="card-title text-primary mb-4">Tienes alguna idea que mejoraría nuestra calidad ambiental?</h2>
        <textarea
                class="textarea textarea-bordered w-full h-32 mb-2"
                placeholder="Escribe tu idea aquí..."
                bind:value={newIdeaText}
        ></textarea>

        <!-- Select de comunidad (opcional). Si compartes tu ubicación, te sugerimos las más cercanas. -->
        <div class="mb-4">
            <SvelteSelect
                    items={comunidades}
                    inputStyles="color: var(--text-primary); "
                    containerStyles="border-color: var(--text-primary); "
                    bind:value={selectedComunidad}
                    placeholder={loadingComunidades ? 'Cargando comunidades…' : 'Selecciona tu comunidad (opcional)'}
                    clearable={true}
                    searchable={true}
            />
        </div>

        <div class="card-actions justify-end">
            <button
                    class="btn btn-primary text-white disabled:bg-primary/10"
                    {onclick}
                    disabled={!newIdeaText.trim()}
            >
                Publicar Idea
            </button>
        </div>
    </div>
</div>

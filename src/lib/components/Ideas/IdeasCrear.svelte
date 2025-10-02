<script lang="ts">
    import SvelteSelect from 'svelte-select';
    import './select.css'
    import api from "../../../utils/api";
    import {onMount} from 'svelte';
    import toast from "../../toast";

    type ComunidadValue = { nombre: string; municipio?: string; lat?: number; lon?: number; lng?: number };
    type ComunidadOption = { id: number; label: string; value: ComunidadValue };

    let {ideas} = $props();
    let newIdeaTitle: string = $state('');
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

    const onSave = async () => {
        if (!selectedComunidad?.id) {
            toast.push('Selecciona una comunidad');
            return;
        }
        try {
            let {data} = await api.post(`/ideas`, {
                titulo: newIdeaTitle,
                descripcion: newIdeaText,
                comunidadId: selectedComunidad?.id
            });
            toast.push("Idea creada exitosamente");
            newIdeaTitle = '';
            newIdeaText = '';
            selectedComunidad = null;
            ideas.unshift(data);
        } catch (e) {
            console.error('Error guardando idea', e);
            toast.push('Error guardando idea');
            return;
        }
    }
    const onclick = () => {
        onSave();
    };

    async function searchByNombre(filterText: string) {
        if (filterText === '') return Promise.resolve()
        try {
            loadingComunidades = true;
            const q = (filterText ?? '').trim();
            const url = q
                ? `/comunidades?limit=1200&nombre=${encodeURIComponent(q)}`
                : `/comunidades?limit=1200`;
            const {data: res}: any = await api.get(url);
            const list: any[] = res?.data ?? res?.comunidades ?? res ?? [];
            const mapped: ComunidadOption[] = list.map((it: any) => {
                const {lat, lon} = getLatLon(it);
                const nombre = it?.nombre ?? it?.name ?? it?.comunidad ?? 'Comunidad';
                const municipio = it?.municipio ?? it?.city ?? it?.municipality;
                const label = `${nombre}${municipio ? ` (${municipio})` : ''}`;
                return {id: it.id, label, value: {nombre, municipio, lat, lon}} as ComunidadOption;
            });
            comunidades = mapped;
            return mapped;
        } catch (e) {
            console.error('Error buscando comunidades por nombre', e);
            return [];
        } finally {
            loadingComunidades = false;
        }
    }

    onMount(() => {
        // loadComunidades();
    })
</script>
<div class="card bg-base-100 shadow-xl w-full mx-auto mb-12">
    <div class="card-body">
        <h2 class="card-title text-primary mb-4">Tienes alguna idea que mejoraría nuestra calidad ambiental?</h2>
        <input class="input input-md w-full mb-2"
               placeholder="Escribe un titulo para la idea"
               bind:value={newIdeaTitle}
        />
        <textarea
                class="textarea textarea-bordered textarea-md w-full mb-2"
                placeholder="Escribe tu idea aquí..."
                bind:value={newIdeaText}
        ></textarea>
        <!-- Select de comunidad (opcional). Si compartes tu ubicación, te sugerimos las más cercanas. -->
        <div class="mb-4">
            <SvelteSelect
                    items={comunidades}
                    inputStyles="color: var(--text-primary); "
                    containerStyles="border-color: var(--text-primary); "
                    loadOptions={searchByNombre}
                    bind:value={selectedComunidad}
                    hideEmptyState={true}
                    debounceWait={500}
                    placeholder={loadingComunidades ? 'Cargando comunidades…' : 'Busca una comunidad'}
                    clearable={true}
                    searchable={true}
            />
        </div>

        <div class="card-actions justify-end">
            <button
                    class="btn btn-primary text-white disabled:bg-primary/10"
                    {onclick}
                    disabled={!newIdeaText.trim() || !selectedComunidad?.id}
            >
                Publicar Idea
            </button>
        </div>
    </div>
</div>

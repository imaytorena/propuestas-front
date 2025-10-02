<script lang="ts">
    import {onMount} from 'svelte'
    import Map from "../lib/components/Map.svelte";
    import IdeaCard from "../lib/components/Ideas/IdeaCard.svelte";
    import VerMas from "../lib/components/VerMas.svelte";
    import IdeasCrear from "../lib/components/Ideas/IdeasCrear.svelte";
    import api from "../utils/api";

    // Form state
    let loading = $state(true)
    let error: string | null = $state(null)
    // todo make typoe
    let ideas = $state([])
    let colonias: (never | any)[] = $state([])
    let selectedColonia: { nombre: string; municipio: string } | null = $state(null);
    let selectedOption = $state('Ideas');

    const loadColonias = async () => {
        error = null
        let cursor: string | null | undefined = undefined
        let pageCount = 0
        try {
            while (true) {
                const url = `/colonias` + (cursor ? `?cursor=${encodeURIComponent(cursor)}` : '?limit=200')
                const {data: json}: any = await api.get(url);
                colonias = [...(colonias ?? []), ...json.data]
                // Determine the next cursor from common fields
                const next = (json && (json.cursor ?? json.nextCursor ?? json.next_cursor ?? json.data?.cursor ?? json.meta?.nextCursor)) ?? null
                cursor = next || null
                pageCount++
                if (!cursor || pageCount > 100) break
            }
        } catch (e: any) {
            error = e?.message ?? 'Error cargando colonias'
            loading = false
        }
    }

    async function loadIdeas() {
        error = null
        try {
            const {data} = await api.get(`/ideas?limit=5`)
            ideas = data.data
        } catch (e: any) {
            error = e?.message ?? 'Error cargando idea'
            throw e;
        } finally {
            loading = false
        }
    }

    const switchOption = (option: string) => {
        selectedOption = option;
    };

    onMount(() => {
        colonias = []
        // Load colonias progressively (do not await)
        loadColonias();
        loadIdeas();
    })

    function handleColoniaClick(colonia: any) {
        selectedColonia = colonia;
        // Aquí puedes filtrar las ideas por colonia o realizar otras acciones
        // console.log('Colonia seleccionada:', colonia);
    }
</script>

{#if error}
    <p style="color:crimson">{error}</p>
{/if}
<div class="container mx-auto p-4">
    <section class="mb-12">
        <h2 class="font-delius mb-4 text-center text-xl font-bold text-primary">
            Da click en alguna colonia para conocer sus areas de oportunidad
        </h2>
        <div class="grid grid-cols-1 lg:flex gap-4">
            {#if colonias.length}
                <Map colonias={colonias}
                     onColoniaClick={handleColoniaClick}
                />
            {/if}
            {#if selectedColonia}
                <div class="grid grid-cols-2 lg:grid-cols-1 gap-4 items-center">
                    <div class="mt-4 h-max w-full rounded-lg border-2 border-primary/50 bg-primary/20 p-4">
                        <h3 class="text-lg lg:text-xl font-semibold text-primary">
                            Colonia: {selectedColonia.nombre}</h3>
                        <p class="text-primary/80 break-words md:break-normal">
                            Municipio: {selectedColonia.municipio}</p>
                    </div>
                    <div>
                        <div class="mt-4 w-full rounded-lg bg-base-100 p-2">
                            <p class="text-primary/80">Ideas: 8</p>
                        </div>
                        <div class="mt-4 w-full rounded-lg bg-base-100 p-2">
                            <p class="text-primary/80">Propuestas: 10</p>
                        </div>
                        <div class="mt-4 w-full rounded-lg bg-base-100 p-2">
                            <p class="text-primary/80">Actividades: 2</p>
                        </div>
                        <div class="mt-4 w-full rounded-lg bg-base-100 p-2">
                            <p class="text-primary/80">Comunidades: 39</p>
                        </div>

                    </div>
                    <div class="col-span-2 lg:col-span-1">
                        <button class="btn btn-primary mt-4 w-full py-2 text-white">Ver más</button>
                    </div>
                </div>
            {/if}
        </div>
    </section>
    <section>
        <div class="flex w-full flex-wrap items-center justify-center gap-5">
            {#each ['Ideas', 'Actividades', 'Propuestas', 'Comunidades'] as tab}
                <button
                        class="btn {selectedOption === tab
                ? 'btn-primary btn-active text-white '
                : 'btn-ghost text-primary'} btn-lg border-2 border-primary hover:border-primary"
                        onclick={() => switchOption(tab)}>{tab}</button
                >
            {/each}
        </div>
        <!-- Ideas Section -->
        <div class="mt-6">
            {#if selectedOption === 'Ideas'}
                <IdeasCrear {ideas}/>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Ideas[] -->
                    {#each ideas as idea}
                        <IdeaCard {idea}/>
                    {/each}
                    <VerMas opcion="ideas"/>
                </div>
            {/if}
            <!--{#if selectedOption === 'Actividades' && actividades?.length}-->
            <!--    <div class="flex flex-wrap justify-center gap-4">-->
            <!--        {#each actividades as actividad}-->
            <!--            <ActividadPreview {actividad}/>-->
            <!--        {/each}-->
            <!--        <div class="h-[150px] w-full">-->
            <!--            <VerMas opcion="actividades"/>-->
            <!--        </div>-->
            <!--    </div>-->
            <!--{/if}-->
            <!--{#if selectedOption === 'Propuestas' && propuestas?.length}-->
            <!--    <div class="flex flex-wrap justify-center gap-4">-->
            <!--        {#each propuestas as propuesta}-->
            <!--            <PropuestasPreview {propuesta}/>-->
            <!--        {/each}-->
            <!--        <div class="h-[150px] w-full">-->
            <!--            <VerMas opcion="actividades"/>-->
            <!--        </div>-->
            <!--    </div>-->
            <!--{/if}-->
        </div>
    </section>

    <section class="mt-20">
        <!--		<h3 class="text-3xl text-center font-bold text-base-content mb-8">Comparte lo que te gusta</h3>-->
        <div class="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
            <!--                <PropuestaCard />-->

            <ul class="w-2xl mx-auto mb-4 flex flex-col gap-4 text-lg text-base-content/80">
                <li class="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M12 3.75c-3.476 0-6.25 2.717-6.25 6.016c0 2.005.82 3.733 2.285 4.81c.323.237.6.591.705 1.04c.087.369.186.818.284 1.294h2.226v-1.083a.75.75 0 0 1 .117-.403l.802-1.26l-1.799-1.412a.75.75 0 0 1-.17-.993l1.167-1.832a.75.75 0 0 1 1.266.806l-.802 1.259l1.799 1.413a.75.75 0 0 1 .17.992l-1.05 1.649v.864h2.226c.098-.476.197-.925.284-1.294c.106-.449.382-.803.705-1.04c1.464-1.077 2.285-2.806 2.285-4.81c0-3.299-2.774-6.016-6.25-6.016m2.689 14.66H9.31c.11.637.197 1.24.224 1.674c.027.457.368.866.871.974l.196.043c.92.199 1.875.199 2.796 0l.196-.043c.503-.108.844-.517.872-.974c.026-.433.112-1.037.223-1.674M4.25 9.766C4.25 5.59 7.744 2.25 12 2.25s7.75 3.341 7.75 7.516c0 2.424-1.004 4.627-2.897 6.018a.32.32 0 0 0-.133.176a51 51 0 0 0-.394 1.843c-.183.938-.332 1.848-.363 2.372c-.07 1.158-.922 2.105-2.052 2.35l-.196.042c-1.13.244-2.3.244-3.43 0l-.196-.042c-1.13-.244-1.982-1.192-2.052-2.35c-.031-.524-.18-1.434-.363-2.372a51 51 0 0 0-.394-1.843a.32.32 0 0 0-.133-.176C5.254 14.394 4.25 12.19 4.25 9.767"
                                clip-rule="evenodd"
                        />
                    </svg>
                    Registra una idea en el panel
                </li>
                <li class="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M8.93 4.47a17.5 17.5 0 0 0-3.86 0a.666.666 0 0 0-.586.577a16.8 16.8 0 0 0 0 3.907a.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19 19 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.3 18.3 0 0 1 0 4.256a2.166 2.166 0 0 1-1.91 1.893c-1.382.154-2.81.154-4.192 0a2.166 2.166 0 0 1-1.91-1.893a18.3 18.3 0 0 1 0-4.256a2.166 2.166 0 0 1 1.91-1.892M8.93 14.47a17.5 17.5 0 0 0-3.86 0a.666.666 0 0 0-.586.576a16.8 16.8 0 0 0 0 3.908a.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19 19 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.3 18.3 0 0 1 0 4.256a2.166 2.166 0 0 1-1.91 1.892c-1.382.155-2.81.155-4.192 0a2.166 2.166 0 0 1-1.91-1.892a18.3 18.3 0 0 1 0-4.256a2.166 2.166 0 0 1 1.91-1.892M18.93 4.47a17.5 17.5 0 0 0-3.86 0a.666.666 0 0 0-.586.577a16.8 16.8 0 0 0 0 3.907a.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19 19 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.3 18.3 0 0 1 0 4.256a2.166 2.166 0 0 1-1.91 1.893c-1.382.154-2.81.154-4.192 0a2.166 2.166 0 0 1-1.91-1.893a18.3 18.3 0 0 1 0-4.256a2.166 2.166 0 0 1 1.91-1.892m4.027 11.49a17.5 17.5 0 0 0-3.86 0a.666.666 0 0 0-.586.576a16.8 16.8 0 0 0 0 3.908a.666.666 0 0 0 .587.576c1.271.142 2.587.142 3.858 0a.666.666 0 0 0 .587-.576c.152-1.298.152-2.61 0-3.908a.666.666 0 0 0-.587-.576m-4.026-1.49a19 19 0 0 1 4.192 0c.99.11 1.793.89 1.91 1.892a18.3 18.3 0 0 1 0 4.256a2.166 2.166 0 0 1-1.91 1.892c-1.382.155-2.81.155-4.192 0a2.166 2.166 0 0 1-1.91-1.892a18.3 18.3 0 0 1 0-4.256a2.166 2.166 0 0 1 1.91-1.892"
                                clip-rule="evenodd"
                        />
                    </svg>
                    Checa algunas de las propuestas.
                </li>
                <li class="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                fill="currentColor"
                                d="M6.75 7.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0M11 4.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M3.25 17A3.75 3.75 0 0 1 7 13.25h.34q.28.001.544.086l.866.283a7.25 7.25 0 0 0 4.5 0l.866-.283c.175-.057.359-.086.543-.086H15A3.75 3.75 0 0 1 18.75 17v1.188c0 .754-.546 1.396-1.29 1.517a40.1 40.1 0 0 1-12.92 0a1.54 1.54 0 0 1-1.29-1.517zM7 14.75A2.25 2.25 0 0 0 4.75 17v1.188c0 .018.013.034.031.037c4.119.672 8.32.672 12.438 0a.04.04 0 0 0 .031-.037V17A2.25 2.25 0 0 0 15 14.75h-.34a.3.3 0 0 0-.079.012l-.865.283a8.75 8.75 0 0 1-5.432 0l-.866-.283a.3.3 0 0 0-.077-.012z"
                                clip-rule="evenodd"
                        />
                        <path
                                fill="currentColor"
                                d="M19.5 6.25a.75.75 0 0 1 .75.75v1.75H22a.75.75 0 0 1 0 1.5h-1.75V12a.75.75 0 0 1-1.5 0v-1.75H17a.75.75 0 0 1 0-1.5h1.75V7a.75.75 0 0 1 .75-.75"
                        />
                    </svg>
                    Únete a alguna de las comunidades
                </li>
                <li class="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                fill="currentColor"
                                d="M12.35 8.7a.75.75 0 0 1 .75.75v2h2a.75.75 0 0 1 0 1.5h-2v2a.75.75 0 0 1-1.5 0v-2h-2a.75.75 0 0 1 0-1.5h2v-2a.75.75 0 0 1 .75-.75"
                        />
                        <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M4.592 15.304C2.344 9.787 6.403 3.75 12.36 3.75h.321a8.07 8.07 0 0 1 8.068 8.068a8.98 8.98 0 0 1-8.982 8.982h-7.82a.75.75 0 0 1-.47-1.335l1.971-1.583a.25.25 0 0 0 .075-.29zM12.36 5.25c-4.893 0-8.226 4.957-6.38 9.488l.932 2.289a1.75 1.75 0 0 1-.525 2.024l-.309.249h5.689a7.48 7.48 0 0 0 7.482-7.482a6.57 6.57 0 0 0-6.568-6.568z"
                                clip-rule="evenodd"
                        />
                    </svg>
                    Comparte tus comentarios con las de los demás.
                </li>
                <li class="flex gap-2 font-bold text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M10.47 3.554a4 4 0 1 1 3.06 7.391a4 4 0 0 1-3.06-7.39M12 4.75a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m-6.53 7.805a4 4 0 1 1 3.061 7.391a4 4 0 0 1-3.062-7.392M7 13.75a2.5 2.5 0 1 0 0 5.001a2.5 2.5 0 0 0 0-5.001m10-1.5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-.957 1.69a2.5 2.5 0 1 1 1.914 4.62a2.5 2.5 0 0 1-1.914-4.62"
                                clip-rule="evenodd"
                        />
                    </svg>
                    Hagamos comunidad!!
                </li>
            </ul>
        </div>
    </section>
</div>

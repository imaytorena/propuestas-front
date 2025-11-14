<script lang="ts">
    // Mock data for the blog-like view
    import api from '../../utils/api';
    import { onMount } from 'svelte';

    type Card = {
        id: string | number;
        titulo: string;
        contenido: string;
        image?: string;
        href?: string;
        tag?: string;
    };


    type sections = {
        key: string;
        title: string;
        description: string;
        cta?: { label: string; href: string };
        items: Card[]
    }

    let loading = $state(true)
    let error: string | null = $state(null)
    let sections: sections[] = $state([]);
    let section: Card[] = $state([]);


    let ideas: Card[] = $state([]);
    let totalIdeas = 0;
    let pageCountIdeas = 0;
    let pageIdeasSize = $state(9)

    let propuestas: Card[] = $state([]);
    let totalPropuestas = 0;
    let pageCountPropuestas = 0;
    let pagePropuestasSize = $state(9)

    let actividades: Card[] = $state([]);
    let totalActividades = 0;
    let pageCountActividades = 0;
    let pageActividadesSize = $state(9)

    let comunidades: Card[] = $state([]);
    let totalComunidades = 0;
    let pageCountComunidades = 0;
    let pageComunidadesSize = $state(9)

    async function getIdeas() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/ideas?limit=6`)
            ideas = data.data ?? []
            totalIdeas = data.meta?.total ?? ideas.length
            pageCountIdeas = data.meta?.pageCount ?? Math.max(1, Math.ceil(totalIdeas / pageIdeasSize))
            sections.push({
                key: 'ideas',
                title: 'Ideas',
                description: 'Explora ideas ciudadanas para inspirar proyectos.',
                cta: {label: 'Ver todas', href: '/ideas'},
                items: ideas
            } );
        } catch (e: any) {
            error = e?.message ?? 'Error cargando ideas'
        } finally {
            loading = false
        }
    }

    async function getPropuestas() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/propuestas?limit=6`)
            propuestas = data ?? [];
            totalPropuestas = data.meta?.total ?? propuestas.length
            pageCountPropuestas = data.meta?.pageCount ?? Math.max(1, Math.ceil(totalPropuestas / pagePropuestasSize))
            sections.push({
                key: 'propuestas',
                title: 'Propuestas',
                description: 'Iniciativas concretas para ejecutar con apoyo institucional.',
                cta: {label: 'Ver todas', href: '/propuestas'},
                items: propuestas
            } );
        } catch (e: any) {
            error = e?.message ?? 'Error cargando propuestas'
        } finally {
            loading = false
        }
    }

    async function getComunidades() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/comunidades?limit=9`)
            comunidades = (data ?? []).slice(0, 6);
            totalComunidades = data.meta?.total ?? comunidades.length
            pageCountComunidades = data.meta?.pageCount ?? Math.max(1, Math.ceil(totalComunidades / pageComunidadesSize))
            sections.push({
                key: 'comunidades',
                title: 'Comunidades',
                description: 'Iniciativas concretas para ejecutar con apoyo institucional.',
                cta: {label: 'Ver todas', href: '/comunidades'},
                items: comunidades
            } );
        } catch (e: any) {
            error = e?.message ?? 'Error cargando comunidades'
        } finally {
            loading = false
        }
    }
/*
    async function getActividades() {
        loading = true
        error = null
        try {
            const {data} = await api.get(`/actividades`)
            actividades = data ?? [];
            totalActividades = data.meta?.total ?? actividades.length
            pageCountActividades = data.meta?.pageCount ?? Math.max(1, Math.ceil(totalActividades / pageActividadesSize))
            sections.push({
                key: 'actividades',
                title: 'Actividades',
                description: 'Iniciativas concretas para ejecutar con apoyo institucional.',
                cta: {label: 'Ver todas', href: '/actividades'},
                items: propuestas
            } );
        } catch (e: any) {
            error = e?.message ?? 'Error cargando propuestas'
        } finally {
            loading = false
        }
    }

 */

    onMount(async () => {
        await getIdeas();
        await getPropuestas();
        await getComunidades();
    });


</script>

<section class="py-8">
    <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold">Participación</h1>
        <p class="mt-2 text-base-content/70 max-w-2xl mx-auto">
            Descubre ideas, propuestas, actividades y comunidades. Participa con tu voz y manos para mejorar tu ciudad.
        </p>
    </header>

    <div class="space-y-14">
        {#each sections as section}
            <section class="space-y-2">
                <details open>
                    <summary class="flex items-end justify-between gap-4 cursor-pointer select-none">
                        <div>
                            <h2 class="text-2xl font-semibold">
                                <span class="link link-sm">{section.title}</span>
                                {#if section.items && section.items.length}
                                    <span class="ml-2 text-sm text-base-content/60">({section.items.length})</span>
                                {/if}
                            </h2>
                            <p class="text-base-content/70">{section.description}</p>
                        </div>
                        {#if section.cta?.href}
                            <a class="btn btn-ghost btn-sm" href={section.cta.href}>Ver todas</a>
                        {/if}
                    </summary>

                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each section.items as item}
                            <article class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                                {#if item.image}
                                    <figure class="aspect-[16/9] overflow-hidden">
                                        <img src={item.image} alt={item.titulo} class="w-full h-full object-cover"
                                             loading="lazy"/>
                                    </figure>
                                {/if}
                                <div class="card-body flex flex-col gap-4 p-4">
                                    <span class="badge badge-outline badge-primary text-xs self-end">{section.title}</span>
                                    <h3 class="card-title text-lg">{item.titulo ?? item.nombre}</h3>
                                    <p class="text-sm text-base-content/70">{item.descripcion}</p>
                                    <div class="card-actions justify-end mt-2">
                                        <a href={"/"+section.key+"/"+item.id} class="btn btn-sm btn-primary">Ver más</a>
                                    </div>
                                </div>
                            </article>
                        {/each}
                    </div>
                </details>
            </section>
        {/each}
    </div>
</section>

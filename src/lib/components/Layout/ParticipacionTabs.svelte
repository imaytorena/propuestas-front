<script lang="ts">
    import Tab from '../Tab.svelte';
    // import { page } from '$app/state';    import {onMount} from 'svelte'
    import {route} from '../../../router'
    import {goto} from '../../../utils/nav'

    let ideaId: string = ''
    ideaId = $route.params.ideaId
    const {children} = $props();

    let checked = $state('');
    let tipoVista = $state('');

    // $effect(() => {
    //     checked = route.id?.split('/')[1] ?? '';
    // });

    // $effect(() => {
    //     tipoVista = route.id?.startsWith('/participacion')
    //         ? 'participacion'
    //         : route.id?.startsWith('/propuestas')
    //             ? 'propuestas'
    //             : route.id?.startsWith('/actividades')
    //                 ? 'actividades'
    //                 : 'ideas';
    // });
</script>

<div class="block md:hidden mb-2 flex w-full flex-col items-start justify-start gap-1">
    {#each [{name: 'ideas', label: 'Ideas'}, {name: 'propuestas', label: 'Propuestas'}, {
        name: 'actividades',
        label: 'Actividades'
    }, {name: 'participacion', label: 'Participación'}] as element}
        {#if checked !== element.name}
            <div>
                <a
                        class="text-md flex items-center justify-center gap-1 text-gray-700 hover:text-gray-700"
                        href="/{element.name}"
                >
                    {element.label}
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-primary" width="18" height="18"
                         viewBox="0 0 24 24">
                        <g
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                        >
                            <path d="m11 9l3 3l-3 3"/>
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/>
                        </g>
                    </svg>
                </a>
            </div>
        {/if}
    {/each}
</div>

<div class="mb-6 flex items-center justify-between">
    <div class="flex flex-col items-start">
        <h2 class="mb-2 text-3xl font-bold flex items-center gap-1">
            {#if tipoVista == 'participacion'}
                Participación
            {:else if tipoVista == 'propuestas'}
                Propuestas
            {:else if tipoVista == 'actividades'}
                Actividades
            {:else}
                Ideas
            {/if}
            <div class="block md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                       stroke-width="2">
                        <path d="m15 11l-3 3l-3-3"/>
                        <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18"/>
                    </g>
                </svg>
            </div>
        </h2>
        <p class="md:h-8 max-w-2xl text-sm">
            {#if tipoVista == 'participacion'}
                La participación es la forma en las personas se involucran en la realización de los
                proyectos, puede ser mediante Propuestas o Actividades.
            {:else if tipoVista == 'propuestas'}
                Una propuesta es un proyecto que se propone realizar con el fin de encontrar soluciones
                sostenibles para la comunidad.
            {:else if tipoVista == 'actividades'}
                Las actividades son eventos que se realizan de manera presencial o virtual con el objetivo
                de realizar cambios en favor del medio ambiente.
            {:else}
                Las ideas son solo eso, ideas. Son sugerencias que se pueden convertir en propuestas o
                actividades para encontrar soluciones a partir de ellas.
            {/if}
        </p>
    </div>
    <!--{#if tipoVista !== 'participacion' && tipoVista !== 'ideas' && userIsLogged}-->
    <!--    <a-->
    <!--            href={page.route.id?.endsWith('/nueva') ? '' : page.route.id + '/nueva'}-->
    <!--            class="btn btn-primary rounded-md px-4 py-2 text-white transition-colors"-->
    <!--    >-->
    <!--        Crear una-->
    <!--        {#if tipoVista == 'propuestas'}-->
    <!--            Propuestas-->
    <!--        {:else}-->
    <!--            Actividades-->
    <!--        {/if}-->
    <!--    </a>-->
    <!--{/if}-->
</div>

<div role="tablist" class="tabs tabs-lifted overflow-x-scroll md:overflow-x-hidden">
    <Tab
            label={checked == 'participacion' ? '____________' : 'Participación'}
            group="participacion_group"
            id="participacion"
            bind:value={checked}
            isLink
    >
        {@render children()}
    </Tab>
    <Tab
            label={checked == 'propuestas' ? '__________' : 'Propuestas'}
            group="participacion_group"
            id="propuestas"
            bind:value={checked}
            isLink
    >
        {@render children()}
    </Tab>
    <Tab
            label={checked == 'actividades' ? '___________' : 'Actividades'}
            group="participacion_group"
            id="actividades"
            bind:value={checked}
            isLink
    >
        {@render children()}
    </Tab>
    <Tab
            label={checked == 'ideas' ? '_____' : 'Ideas'}
            group="participacion_group"
            id="ideas"
            bind:value={checked}
            isLink
    >
        {@render children()}
    </Tab>
</div>
